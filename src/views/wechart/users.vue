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
                        <p class="title_name">设备总数</p>
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
                        <p class="title_name">在线设备</p>
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
                        <p class="title_name">离线设备</p>
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
                        <p class="title_name">报警设备</p>
                        <count-to :start-val="0" :end-val="userNumty" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <!-- <el-row>
        <span>方块选择</span>
        <select name="" id=""  v-model="selected" @change="selectbj(selected)">
            <option v-for="option in layouts" value="option.value">{{option.name}}</option>
        </select>
    </el-row> -->
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
        selected:0;
        layouts:[
            {name:'1X1模式',value:'0'},
            {name:'2X1模式',value:'1'},
            {name:'2X2模式',value:'2'},
            {name:'3X3模式',value:'3'},
            {name:'1+5模式',value:'4'},
            ]
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
                this.userNumt=res.active
            }).catch(err=>{

            })
        },
        getUserListo(){
            api.getUserCounts({day:30}).then(res=>{
                this.userNumo=res.active
            }).catch(err=>{

            })
        },
        getUserListty(){
            api.getUserCounts({day:90}).then(res=>{
                this.userNumty=res.active
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
        #users {
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
        #users {
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
        #users {
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
        #users {
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
