<template>
    <div id="location">
        <el-row :gutter="10">
            <el-col :span="8" :lg="6">
                <el-card shadow="always" :style="'height:'+height+'px'" v-loading="listLoading">
                        <div style="display:flex;">
                            <el-input
                                placeholder="输入imei进行过滤"
                                type="text"
                                v-model="imei"
                                clearable>
                            </el-input>
                            <el-button @click="refresh" style="marginLeft:20px;">清空</el-button>
                        </div>
                        <div id="" :style="{height:height-150+'px',overflow:'hidden'}" class="mt20">
                            <el-scrollbar :style="{height:height-130+'px'}" ref="scroll">
                                <div>
                                    <el-tree
                                        class="filter-tree"
                                        :data="equList"
                                        :props="{ children: 'children', label: 'imei' }"
                                        node-key="id"
                                        default-expand-all
                                        show-checkbox
                                        @check="checkChange"
                                        ref="tree2">
                                    </el-tree>
                                </div>
                            </el-scrollbar>
                        </div>
                        <el-pagination
                            small
                            @current-change="changeindex"
                            :current-page.sync="page.index"
                            :page-size="page.size"
                            :pager-count="5"
                            layout="prev, pager, next"
                            class="mt20"
                            :disabled="imei?true:false"
                            :total="page.total">
                        </el-pagination>
                </el-card>
            </el-col>
            <el-col :span="16" :lg="18">
                <el-card shadow="always" :style="'height:'+height+'px'">
                    <div id="map" :style="{height:height-40+'px',overflow:'hidden' }">

                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    export default{
        name:'location',
        mixins:[mixin],
        data(){
            return {
                roles:this.$store.getters.roles,
                listLoading:true,
                equList:[],
                height:0,
                imei:'',
                map:null,
                mapMarker:[],
                mapMarkerEvent:[],
                infoWindow:null,
                polyline:null,
                timer:null
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-130
            this.setMap('map')
            this.getList()
        },
        watch: {
            imei(news){
                clearTimeout(this.timer)
                this.timer = setTimeout(()=>{
                    if (news) {
                        this.search()
                    }else{
                        this.getList(this.page.index)
                    }
                }, 500);
            }
        },
        methods:{
            checkChange(obj,state){
                if(state.checkedKeys.filter(res=>res==obj.id).length){
                    obj.disabled=true
                    this.$refs.tree2.setCheckedKeys(this.$refs.tree2.getCheckedKeys());
                    this.getLocation(obj)
                }else{
                    const filter=this.mapMarker.filter(data=>data.id==obj.id)
                    if(filter.length){
                        AMap.event.removeListener(filter[0].event)
                        this.map.remove(filter[0].mapker)
                        this.mapMarker.splice(this.mapMarker.indexOf(filter[0]),1)
                    }
                }
            },
            getLocation(obj){
                api.getLocation(obj.id).then(res=>{
                    if(res&&res.latitude&&res.longitude){
                        let _this=this
                        let mapker=new AMap.Marker({
                            position: [res.longitude,res.latitude],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                            map:this.map
                        })
                        this.map.setCenter([res.longitude,res.latitude]); 
                        this.mapMarker.push({id:obj.id,mapker:mapker,event:AMap.event.addListener(mapker, 'click', function() {
                            var infoWindow;
                            var info=`<div>imei:${this.imei}</div><div>时间:${this.time}</div><div>定位方式:${this.wifiGpsFlag===2?'WIFI':(this.wifiGpsFlag===1?'GPS':(this.wifiGpsFlag===0?'基站':''))}</div>`
                            infoWindow = new AMap.InfoWindow({
                                content: info,  //使用默认信息窗体框样式，显示信息内容
                                offset:new AMap.Pixel(0,-20),
                                closeWhenClickMap:true
                            });
                            AMap.event.addListener(infoWindow,'open',function(){_this.infoWindow=this})
                            infoWindow.open(_this.map,mapker.getPosition());
                        },{time:res.eventTime,imei:obj.imei,wifiGpsFlag:res.wifiGpsFlag})})
                        obj.disabled=false
                        this.$refs.tree2.setCheckedKeys(this.$refs.tree2.getCheckedKeys());
                    }else{
                        return Promise.reject()
                    }
                }).catch(err=>{
                    obj.disabled=false
                    this.$refs.tree2.setCheckedKeys(this.$refs.tree2.getCheckedKeys());
                    const list=this.$refs.tree2.getCheckedKeys().filter(res=>res!==obj.id)
                    this.$refs.tree2.setCheckedKeys(list);
                    this.$message.error('获取失败');
                })
            },
            search(){
                this.$refs.tree2.setCheckedKeys([])
                this.rollBack('scroll')
                this.listLoading=true
                api.getEquList(this.imei).then(_=>{
                    if(Array.isArray(_)){
                        const list=[]
                        for(let i in _){
                            _[i].imei=`${ _[i].imei}(${ _[i].model.substr(0,4)})`
                            if(this.mapMarker.filter(res=>res.id==_[i].id).length){
                                list.push(_[i].id)
                            }
                        }
                        this.page.total= _.length
                        this.equList= _
                        this.$refs.tree2.setCheckedKeys(list)
                    }else{
                        this.$message.error('获取列表失败');
                    }
                    this.listLoading=false
                }).catch(_=>{
                    this.$message.error('获取列表失败');
                    this.listLoading=false
                })
            },
            isMap(){
                if(this.active=='map'){
                    this.setMap('map') 
                }
            },
            setMap(id){
                this.map = new AMap.Map(id, {
                    resizeEnable: true,
                    zoom:13,//级别
                    center: [121.362426, 31.123795],//中心点坐标
                }); 
            },
            refresh(){
                this.search=''
                this.equList=[]
                this.$refs.tree2.setCheckedKeys([])
                this.deleteMapMarker()
                this.deleteInfoWindow()
                this.changeindex(1)
            },
            getList(){
                this.$refs.tree2.setCheckedKeys([])
                this.rollBack('scroll')
                this.listLoading=true
                api.getEquListPagination({pageSize:this.page.size,offset:this.page.index-1}).then(_=>{
                    if(Array.isArray(_.data)){
                        const list=[]
                        console.log(this.mapMarker)
                        for(let i in _.data){
                            _.data[i].imei=`${ _.data[i].imei}(${ _.data[i].model.substr(0,4)})`
                            if(this.mapMarker.filter(res=>res.id==_.data[i].id).length){
                                list.push(_.data[i].id)
                            }
                        }
                        this.page.total= _.page.total
                        this.equList= _.data
                        this.$refs.tree2.setCheckedKeys(list)
                    }else{
                        this.$message.error('获取列表失败');
                    }
                    this.listLoading=false
                }).catch(_=>{
                    this.$message.error('获取列表失败');
                    this.listLoading=false
                })
            },
            deleteInfoWindow(){             //删除信息窗口
                if(this.infoWindow){
                    this.infoWindow.close()
                }
            },
            deleteMapMarker(){              //删除点
                for(let i=0;i<this.mapMarker.length;i++){
                    AMap.event.removeListener(this.mapMarker[i].event)
                    this.map.remove(this.mapMarker[i].mapker)
                }
                this.mapMarker=[]
            },
            deletePolyline(){               //删除线
                if(this.polyline){
                    this.map.remove(this.polyline);
                }
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss">
    #location{
        .el-tree-node__content{
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .el-tree-node__content>.el-tree-node__expand-icon{
            padding: 0;
        }
        .el-tree-node__label{
            font-size:15px;
        }
    }
</style>