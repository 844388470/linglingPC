<template>
    <div id="location">
        <el-row :gutter="10">
            <el-col :span="8" :lg="6">
                <el-card shadow="always" :style="'height:'+height+'px'" v-loading="listLoading">
                    <div id="" :style="{height:height-40+'px',overflow:'hidden' }">
                        <el-scrollbar :style="{height:height-24+'px' }">
                            <div>
                                <div style="display:flex;">
                                    <el-input
                                        placeholder="输入imei进行过滤"
                                        v-model="imei">
                                    </el-input>
                                    <el-button @click="getList" style="marginLeft:20px;">刷新</el-button>
                                </div>
                                <el-tree
                                    class="filter-tree"
                                    :data="equList"
                                    :props="{ children: 'children', label: 'imei' }"
                                    node-key="id"
                                    default-expand-all
                                    show-checkbox
                                    :filter-node-method="filterNode"
                                    @check-change="checkChange"
                                    ref="tree2">
                                </el-tree>
                            </div>
                        </el-scrollbar>
                    </div>
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
    export default{
        name:'location',
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
                polyline:null
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-130
            this.setMap('map')
            this.getList()
        },
        watch: {
            imei(val) {
                this.$refs.tree2.filter(val);
            }
        },
        methods:{
            filterNode(value, data) {
                if (!value) return true;
                return data.imei.indexOf(value) !== -1;
            },
            checkChange(obj,state){
                if(state){
                    obj.disabled=true
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
                    const list=this.$refs.tree2.getCheckedKeys().filter(res=>res!==obj.id)
                    this.$refs.tree2.setCheckedKeys(list);
                    this.$message.error('获取失败');
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
            getList(){
                this.search=''
                this.listLoading=true
                this.equList=[]
                this.$refs.tree2.setCheckedKeys([])
                this.deleteMapMarker()
                this.deleteInfoWindow()
                api.getEquList().then(_=>{
                    if(Array.isArray(_)){
                        for(let i in _){
                            _[i].imei=`${_[i].imei}(${_[i].model.substr(0,4)})`
                        }
                        this.equList=_
                        this.filterSearch()
                    }else{
                        // this.$message.error('获取列表失败');
                    }
                    this.listLoading=false
                }).catch(_=>{
                    // this.$message.error('获取列表失败');
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