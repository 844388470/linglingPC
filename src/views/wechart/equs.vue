<template>
  <div id="equs">
    <el-row :gutter="20" class="title">
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">设备总数</p>
                        <count-to :start-val="0" :end-val="equNum" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">三天内激活设备</p>
                        <count-to :start-val="0" :end-val="equNumt" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">一个月内激活设备</p>
                        <count-to :start-val="0" :end-val="equNumo" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">三个月内激活设备</p>
                        <count-to :start-val="0" :end-val="equNumty" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="20" class="title">
        <el-col :span="6" v-for="(item,index) in titleList" :key="index" class="mb20">
            <el-card shadow="hover">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">设备{{item.model.substr(0,4)}}数量</p>
                        <count-to :start-val="0" :end-val="item.count" :duration="1000" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '@/api/wechart'
import CountTo from 'vue-count-to'
export default {
    name: 'equs',
    components:{
        CountTo
    },
    data() {
        return {
            height:1000,
            equNum:0,
            equNumt:0,
            equNumo:0,
            equNumty:0,
            titleList:[]
        }
    },
    mounted() {
        this.height=document.body.offsetHeight-359
        this.getEquList()
        this.getEquListt()
        this.getEquListo()
        this.getEquListty()
        this.getEquCity()
        this.getEquModel()
    },
    methods: {
        getEquList(){
            api.getEquCount().then(res=>{
                this.equNum=res.all
            }).catch(err=>{

            })
        },
        getEquListt(){
            api.getEquCounts({day:3}).then(res=>{
                this.equNumt=res.recentActive
            }).catch(err=>{
 
            })
        },
        getEquListo(){
            api.getEquCounts({day:30}).then(res=>{
                this.equNumo=res.recentActive
            }).catch(err=>{

            })
        },
        getEquListty(){
            api.getEquCounts({day:90}).then(res=>{
                this.equNumty=res.recentActive
            }).catch(err=>{

            })
        },
        getEquCity(){
            api.getEquCity().then(res=>{
                // console.log(res)
            }).catch(err=>{

            })
        },
        getEquModel(){
            api.getEquModel().then(res=>{
                let list=[],type=res.model
                for(let i in type){
                    if(list.filter(obj=>obj.model==type[i].model.substr(0,4)).length){
                        list.filter(obj=>obj.model==type[i].model.substr(0,4))[0].count+=type[i].count
                    }else{
                        list.push({
                            count:type[i].count,
                            model:type[i].model.substr(0,4),
                        })
                    }
                }
                
                this.titleList=list
            }).catch(err=>{

            })
        },
    },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    #equs {
        .title{
            cursor: pointer;
            margin-bottom: 20px;
            .icon-mobancaidan{
                color: #666;
            }
            .title_name{
                color: #666;
            }
            .title_num{
                font-weight: 600;
                color: #666;
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    @media screen and (min-width: 1400px) {
        #equs {
            .title{
                .icon-mobancaidan{
                    font-size:60px;
                }
                .title_name{
                    font-size: 16px;
                }
                .title_num{
                    font-size: 30px;
                }
            }
        }
    }
    @media (min-width: 1260px) and (max-width: 1400px) {
        #equs {
            .title{
                .icon-mobancaidan{
                    font-size:50px;
                }
                .title_name{
                    font-size: 16px;
                }
                .title_num{
                    font-size: 30px;
                }
            }
        }
    }
    @media (min-width: 1048px) and (max-width: 1260px) {
        #equs {
            .title{
                .icon-mobancaidan{
                    font-size:40px;
                }
                .title_name{
                    font-size: 15px;
                }
                .title_num{
                    font-size: 30px;
                }
                .el-card__body{
                    padding:20px 10px;
                }
            }
        }
    }
    @media screen and (max-width: 1048px) {
        #equs {
            .title{
                .icon-mobancaidan{
                    font-size:30px;
                }
                .title_name{
                    font-size: 14px;
                }
                .title_num{
                    font-size: 30px;
                }
                .el-card__body{
                    padding:20px 5px;
                }
            }
        }
    }
</style>
