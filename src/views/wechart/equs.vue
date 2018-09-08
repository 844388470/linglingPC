<template>
  <div id="equs">
    <el-row :gutter="20" class="title">
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="20">
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
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">最近三天激活设备</p>
                        <count-to :start-val="0" :end-val="equNumt" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">最近一个月激活设备</p>
                        <count-to :start-val="0" :end-val="equNumo" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">最近三个月激活设备</p>
                        <count-to :start-val="0" :end-val="equNumty" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="20" class="title">
        <el-col :span="6" v-for="(item,index) in titleList" :key="index">
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
                this.equNumt=res.all
            }).catch(err=>{
 
            })
        },
        getEquListo(){
            api.getEquCounts({day:30}).then(res=>{
                this.equNumo=res.all
            }).catch(err=>{

            })
        },
        getEquListty(){
            api.getEquCounts({day:90}).then(res=>{
                this.equNumty=res.all
            }).catch(err=>{

            })
        },
        getEquCity(){
            api.getEquCity().then(res=>{
                console.log(res)
            }).catch(err=>{

            })
        },
        getEquModel(){
            api.getEquModel().then(res=>{
                this.titleList=res.model
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
  }
</style>
<style rel="stylesheet/scss" lang="scss">

</style>
