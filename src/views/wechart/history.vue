<template>
    <div id="history">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input v-model="id" placeholder="设备imei"></el-input>
                </el-col>

                <el-col :span="6">
                    <el-date-picker
                        v-model="startTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择开始时间">
                    </el-date-picker>
                </el-col>
                
                <el-col :span="6">
                    <el-date-picker
                        v-model="endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择结束时间">
                    </el-date-picker>
                </el-col>

                <el-col :span="6">
                      <el-button @click="getHistory" :disabled="listLoading">查找</el-button>
                      <el-button @click="getList">刷新</el-button>
                      <!-- <el-button @click="">删除</el-button>
                      <el-button @click="">123</el-button> -->
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="always" :style="'height:'+height+'px'">
            <div id="map" :style="{height:height-40+'px',overflow:'hidden' }">

            </div>
        </el-card>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    export default{
        name:'history',
        data(){
            return {
                roles:this.$store.getters.roles,
                listLoading:true,
                equList:[],
                height:0,
                id:'',
                startTime:'',
                endTime:'',
                map:null,
                mapMarker:[],
                mapMarkerEvent:[],
                infoWindow:null,
                polyline:null
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-235
            this.setMap('map')
            this.getList()
        },
        methods:{
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
                api.getEquList().then(_=>{
                    if(Array.isArray(_)){
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
            getHistory(){
                if(!this.id||!this.startTime||!this.endTime){
                    this.$message.warning('输入有误');
                    return
                }
                if(this.equList.filter(res=>res.imei==this.id).length===0){
                    this.$message.warning('该imei无效');
                    return
                }
                api.getHistory(this.equList.filter(res=>res.imei==this.id)[0].id,{startTime:this.startTime,endTime:this.endTime}).then(res=>{
                    let list=[]
                    this.deleteMapMarker()
                    this.deleteInfoWindow()
                    this.deletePolyline()
                    for(let i in res){
                        if(res[i].longitude&&res[i].latitude){
                            list.push({lang:[res[i].longitude,res[i].latitude],time:res[i].eventTime,wifiGpsFlag:res[i].wifiGpsFlag})
                        }
                    }
                    if(!list.length){
                        this.$message.warning('轨迹为空');
                        return 
                    }
                    this.addMarker(list)
                }).catch(err=>{
                    this.$message({
                        type: 'error',
                        message: '请求错误!'
                    });
                })
            },
            deleteInfoWindow(){
                if(this.infoWindow){
                    this.infoWindow.close()
                }
            },
            deleteMapMarker(){
                for(let i=0;i<this.mapMarker.length;i++){
                    AMap.event.removeListener(this.mapMarkerEvent[i])
                    this.map.remove(this.mapMarker[i])
                }
                this.mapMarker=[]
                this.mapMarkerEvent=[]
            },
            deletePolyline(){
                if(this.polyline){
                    this.map.remove(this.polyline);
                }
            },
            asd(){

            },
            addMarker(list){
                let _this=this
                let polyline=[]
                // for(let i=0;i<this.mapMarker.length;i++){
                //     // AMap.event.removeListener(this.mapMarkerEvent[i])
                //     // this.mapMarkerEvent.splice(i,1)
                //     this.map.remove(this.mapMarker[i])
                //     this.mapMarker.splice(i,1)
                // }
                // let list=[{a:[121.362426, 31.123795],b:1},{a:[121.3641745, 31.123795],b:2},{a:[121.369531, 31.123795],b:3}]
                
                for(let i in list){
                    let mapker=new AMap.Marker({
                        position: list[i].lang,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        map:this.map
                    })
                    polyline.push(list[i].lang)
                    this.mapMarker.push(mapker)
                    this.mapMarkerEvent.push(AMap.event.addListener(mapker, 'click', function() {
                        var infoWindow;
                        console.log(this)
                        var info=`<div>时间:${this.time}</div><div>定位方式:${this.wifiGpsFlag===2?'WIFI':(this.wifiGpsFlag===1?'GPS':(this.wifiGpsFlag===0?'基站':''))}</div>`
                        infoWindow = new AMap.InfoWindow({
                            content: info,  //使用默认信息窗体框样式，显示信息内容
                            offset:new AMap.Pixel(0,-20),
                            closeWhenClickMap:true
                        });
                        AMap.event.addListener(infoWindow,'open',function(){_this.infoWindow=this})
                        infoWindow.open(_this.map,mapker.getPosition());
                    },list[i]))
                }
                this.map.setCenter(list[0].lang); 
                this.polyline = new AMap.Polyline({
                    path: polyline,  
                    strokeWeight: 6, // 线条宽度，默认为 1
                    strokeColor: 'red', // 线条颜色
                    lineJoin: 'round', // 折线拐点连接处样式
                    showDir:true
                });

                // 将折线添加至地图实例
                this.map.add(this.polyline);
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>