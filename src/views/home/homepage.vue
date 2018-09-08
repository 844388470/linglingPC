<template>
  <div id="homepage">
    <el-row :gutter="20" class="title">
        <el-col :span="6" v-for="(item,index) in titleList" :key="index">
            <el-card shadow="hover">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">{{item.name}}</p>
                        <count-to :start-val="0" :end-val="item.num" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="20" class="content">
        <el-col :span="24">
            <el-card shadow="always">
                <div class="content_title">
                    <div class="fl content_title_text mr30">设备概况</div>
                    <el-menu :default-active="active" class="el-menu-demo fl" mode="horizontal"  @select="activeSelect">
                        <el-menu-item index="map">定位</el-menu-item>
                        <el-menu-item index="list">列表</el-menu-item>
                    </el-menu>
                    <div class="fr" v-if="active=='list'">
                        <el-input v-model="listInput" placeholder="请输入用户名" size="small"><el-button :disabled="listState" slot="append" icon="el-icon-search" @click="searchCus"></el-button></el-input>
                    </div>
                    <div class="cl"></div>
                </div>
                <div class="content_main">
                    <div id="map" :style="{'width':'100%',height:height+'px' }" v-show="active=='map'"></div>
                    <div class="map_search" @click="intoSearchInput" @mouseout="mapSearchMouse=true" @mouseover="mapSearchMouse=false">
                        <el-input  class="map_search_input" ref="map_search" v-model="listInput" placeholder="请输入设备号" size="small" @focus="mapSearchFocus=true" @blur="blurSearchInput"></el-input>
                        <el-popover
                            placement="bottom"
                            width="274"
                            v-model="mapSearchFocus">
                            <div style="height:300px">
                                <el-button @click="addMarker">添加点</el-button>
                                <el-button @click="openInfoWindow">打开</el-button>
                                <el-button @click="closeInfoWindow">关闭</el-button>
                            </div>
                        </el-popover>
                    </div>
                    <div id="list"  :style="{'width':'100%',zIndex:99,height:height+'px' }" v-if="active=='list'" v-loading="listState" class="content_main_list_main">
                        <el-scrollbar :style="{height:height+34+'px' }">
                            <el-row :gutter="20" style="overflow:hidden;" class="mr0 ml0 mb20">
                                <el-col :span="12" class="content_main_list" v-for="item in cusList" :key="this">
                                    <el-card shadow="hover">
                                        <p class="cusName">客户A</p>
                                        <p class="address">广东省广州市天河区陶庄路5号</p>
                                        <p class="coordinate">23.168183,113.327153</p>
                                        <el-row :gutter="20">
                                            <el-col :span="6" v-for="item in [1,2,3,4]" :key="this" class="equ">
                                                <p class="equName">设备总数</p>
                                                <p class="equNum">48</p>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </el-col>
                                <el-col :span="24" class="tr" v-if="cusList.length">
                                    <el-pagination
                                        :pageSize='10'
                                        :current-page="currentPage"
                                        @current-change="currentChange"
                                        @prev-click="currentPage-1"
                                        @next-click="currentPage+1"
                                        layout="prev, pager, next"
                                        :total="listTotal">
                                    </el-pagination>
                                </el-col>
                            </el-row>
                        </el-scrollbar>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
    function n(){
        var infoWindow;
        var map = new AMap.Map("map", {
            resizeEnable:true,
            center:[116.473188,39.993253],
            zoom:13
        });
        console.log(map)
        //在指定位置打开信息窗体
        // function openInfo(){
            //构建信息窗体中显示的内容
            var info=[];
            info.push("<div><div><img style=\"flow:left;\" src=\"http://webapi.amap.com/images/autonavi.png\"/></dvi>");
            info.push("<div style=\"padding:0px 0px 0px 4px;\"><b>相思*王维</b>");
            info.push("<b>红豆生南国， 春来发几枝。</b>")
            info.push("<span style=\"color:red;\">愿君</span>多采撷， 此物最相思。")
            info.push("电话：444-556161     邮编 ：102020");
            info.push("地址：上海徐汇区</div></div>");
            infoWindow= new AMap.InfoWindow({
                content: info.join("<br/>")
            });
            infoWindow.open(map, map.getCenter());
        // }
    }
			
import CountTo from 'vue-count-to'
export default {
    name: 'homepage',
    components:{
        CountTo
    },
    data() {
        return {
            titleList:[{name:'设备总数',num:62500},{name:'离线设备数',num:1500},{name:'报警设备数',num:1689},{name:'故障设备数',num:586}],
            height:1000,
            map:null,
            active:'map',                   //打开状态
            listInput:'',                   //搜索框
            listSearch:'',                  //搜索框确认的值
            listState:false,                //加载状态
            listTotal:100,                  //用户总数
            cusList:[],                     //用户列表
            currentPage:1,                  //当前页
            mapSearchFocus:false,           //地图搜索聚焦
            mapSearchMouse:false,           //地图搜索鼠标
            mapMarker:[],                   //地图上的点
            mapMarkerEvent:[],              //点上绑定的事件
            mapFunc:null,
            infoWindow:null,                //地图弹窗
        }
    },
    mounted() {
        this.height=document.body.offsetHeight-359
        // n()
        this.isMap()
    },
    methods: {
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
            this.addMarker()
        },
        activeSelect(value){
            this.active=value
        },
        currentChange(value){
            this.listState=true
            this.cusList=[]
            setTimeout(()=>{
                this.cusList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
                this.currentPage=value
                this.listState=false
            },2000)
        },
        searchCus(){
            this.listSearch=this.listInput
            this.currentChange(1)
        },
        intoSearchInput(){
            this.$refs.map_search.focus()
        },
        blurSearchInput(e){
            if(this.mapSearchMouse){
                this.mapSearchFocus=false
            }
        },
        addMarker(){
            let _this=this
            // this.mapFunc=function(e){
            //     _this.openInfoWindow(e,this)
            // }
            for(let i=0;i<this.mapMarker.length;i++){
                AMap.event.removeListener(this.mapMarkerEvent[i])
                this.mapMarkerEvent.splice(i,1)
                this.map.remove(this.mapMarker[i])
                this.mapMarker.splice(i,1)
            }
            let list=[{a:[121.362426, 31.123795],b:1},{a:[121.3641745, 31.123795],b:2},{a:[121.369531, 31.123795],b:3}]

            for(let i in list){
                let mapker=new AMap.Marker({
                    position: list[i].a,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    map:this.map,
                    title:'666'
                })
                this.mapMarker.push(mapker)
                this.mapMarkerEvent.push(AMap.event.addListener(mapker, 'click', function() {

                    var infoWindow;
                    var info=[];
                    info.push("<div><div><img style=\"flow:left;\" src=\"http://webapi.amap.com/images/autonavi.png\"/></dvi>");
                    info.push("<div style=\"padding:0px 0px 0px 4px;\"><b>相思*王维</b>");
                    info.push("<b>红豆生南国， 春来发几枝。</b>")
                    info.push("<span style=\"color:red;\">愿君</span>多采撷， 此物最相思。")
                    info.push("电话：444-556161     邮编 ："+this);
                    info.push("地址：上海徐汇区</div></div>");
                    infoWindow = new AMap.InfoWindow({
                        content: info.join("<br/>"),  //使用默认信息窗体框样式，显示信息内容
                        offset:new AMap.Pixel(0,-20)
                    });
                    infoWindow.open(_this.map,mapker.getPosition());
                },list[i].b))
            }
            // console.log(this.mapMarker[0])
            // this.map.add(this.mapMarker)
            // this.infoWindow=AMap.event.addListener(this.mapMarker[0], 'click', function() {
            //     console.log(this)
            //     new AMap.InfoWindow({
            //         isCustom: true,  //使用自定义窗体
            //         content: "<div style='backgroundColor:#fff;'>66666</div>",
            //         offset: new AMap.Pixel(16, -45)
            //     }).open(this.map, _this.mapMarker[0].getPosition());
            // });
            // this.mapMarker[0].on('click', this.mapFunc );
            // this.mapMarker[0].on('click', function(e){_this.openInfoWindow(e,this)},{a:1,b:2});
            // this.mapMarker[1].on('click', function(e){_this.openInfoWindow(e,this)},{a:3,b:2});
            
        },
        openInfoWindow(e,value){
                var info=[];
				info.push("<div><div><img style=\"flow:left;\" src=\"http://webapi.amap.com/images/autonavi.png\"/></dvi>");
				info.push("<div style=\"padding:0px 0px 0px 4px;\"><b>相思*王维</b>");
				info.push("<b>红豆生南国， 春来发几枝。</b>")
				info.push("<span style=\"color:red;\">愿君</span>多采撷， 此物最相思。")
				info.push("电话：444-556161     邮编 ：102020");
				info.push("地址：上海徐汇区</div></div>");
				let infoWindow= new AMap.InfoWindow({
					content: info.join("<br/>")
                });
                console.log(infoWindow,this.map.getCenter())
				infoWindow.open(this.map);
            // console.log(e,value)
            // console.log(this)
            // var content = [
            //     "<div style='width:100px;height:100px;backgroundColor:#fff;'>66666</div>",
            // ];
            // this.infoWindow = new AMap.InfoWindow({
            //     content: "<div style='width:100px;height:100px;backgroundColor:#fff;'>66666</div>"  //传入 dom 对象，或者 html 字符串
            // });
            // console.log(this.infoWindow)
            // console.log(this.infoWindow.getIsOpen())
            // this.map.add(this.infoWindow)
            // this.infoWindow.open(this.map);
            // console.log(this.infoWindow.getIsOpen())
        },
        closeInfoWindow(){
            // this.infoWindow.close(this.map);
            // for(let i=0;i<this.mapMarker.length;i++){
            //     this.mapMarker[i].off('click', function(e){_this.openInfoWindow(e,this)},{a:1,b:2})
            //     // this.map.remove(this.mapMarker[i])
            //     // this.mapMarker.splice(i,1)
            // }
            // this.mapMarker[0].off('click', this.mapFunc );
            AMap.event.removeListener(this.mapMarkerEvent[0])
        },
    },
    watch:{
        active(n,m){
            if(n=='list'&&!this.cusList.length){
                this.currentChange(this.currentPage)
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #homepage {
    .title{
        cursor: pointer;
        margin-bottom: 20px;
        .icon-mobancaidan{
            font-size:60px;
            color: #666;
        }
        .title_name{
            line-height:30px;
            font-size: 16px;
            color: #666;
        }
        .title_num{
            line-height:30px;
            font-weight: 600;
            font-size: 30px;
            color: #666;
        }
    }
    .content{
        .content_title{
            width: 100%;
            border-bottom: 1px solid #eee;
            .content_title_text{
                line-height: 30px;
            }
        }
        .content_main{
            padding: 20px 0 0;
            position: relative;
            .map_search{
                position: absolute;
                top: 40px;
                left: 20px;
                width: 300px;
                .map_search_input{
                    margin-bottom: 2px;
                }
            }
            .content_main_list_main{
                overflow: hidden;
            }
            .content_main_list{
                margin-bottom: 20px;
                p{
                    color: #666;
                    font-size: 15px;
                    font-weight: 500;
                    margin-bottom: 5px;
                }
                .cusName{
                    font-size: 18px;
                }
                .equ{
                    font-size: 18px;
                    .equNum{
                        font-size: 35px;
                        font-weight: 600;
                    }
                }
                .equ:hover p{
                    cursor: pointer;
                    color: #409EFF;
                }
            }
        }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
    #homepage {
        .content_title{
            .el-menu-demo{
                border-bottom:0;
                
            }
        }
        .el-menu--horizontal>.el-menu-item{
            height:40px;
            line-height: 30px;
            font-size:16px;
        }
    }
</style>
