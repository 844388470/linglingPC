<template>
  <div id="users">
    <el-row :gutter="20" class="title">
        <el-col :span="6">
            <el-card shadow="hover">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">用户总数</p>
                        <count-to :start-val="0" :end-val="userNum" :duration="2600" class="title_num"/>
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
                        <p class="title_name">最近三天新增用户</p>
                        <count-to :start-val="0" :end-val="userNumt" :duration="2600" class="title_num"/>
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
                        <p class="title_name">最近一个月新增用户</p>
                        <count-to :start-val="0" :end-val="userNumo" :duration="2600" class="title_num"/>
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
                        <p class="title_name">最近三个月新增用户</p>
                        <count-to :start-val="0" :end-val="userNumty" :duration="2600" class="title_num"/>
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
    name: 'users',
    components:{
        CountTo
    },
    data() {
        return {
            height:1000,
            userNum:0,
            userNumt:0,
            userNumo:0,
            userNumty:0,
        }
    },
    mounted() {
        this.height=document.body.offsetHeight-359
        this.getUserList()
        this.getUserListt()
        this.getUserListo()
        this.getUserListty()
    },
    methods: {
        getUserList(){
            api.getUserCount().then(res=>{
                this.userNum=res.all
            }).catch(err=>{

            })
        },
        getUserListt(){
            api.getUserCounts({day:3}).then(res=>{
                this.userNumt=res.all
            }).catch(err=>{

            })
        },
        getUserListo(){
            api.getUserCounts({day:30}).then(res=>{
                this.userNumo=res.all
            }).catch(err=>{

            })
        },
        getUserListty(){
            api.getUserCounts({day:90}).then(res=>{
                this.userNumty=res.all
            }).catch(err=>{

            })
        },
    },
    watch:{
        
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #users {
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
