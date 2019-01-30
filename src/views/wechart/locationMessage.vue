<template>
    <div id="locationMessage" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input v-model="imei" placeholder="设备imei"></el-input>
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
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="always" :style="'height:'+height+'px'">
            <div :style="{height:height-40+'px',overflow:'hidden'}">
                <el-scrollbar :style="{height:height-23+'px' }">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="list"
                            :height="height-40"
                            style="width: 100%">
                            <el-table-column label="定位方式" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.wifiGpsFlag==1?'GPS':scope.row.wifiGpsFlag==2?'WIFI':''}}
                                </template>
                            </el-table-column>
                            <el-table-column label="上传时间" width="200">
                                <template slot-scope="scope">
                                    {{scope.row.eventTime + ''}}
                                </template>
                            </el-table-column>
                            <el-table-column label="纬度" width="200">
                                <template slot-scope="scope">
                                    {{scope.row.latitude+''}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经度" width="200">
                                <template slot-scope="scope">
                                    {{scope.row.longitude+''}}
                                </template>
                            </el-table-column>
                            <el-table-column label="运动状态" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.run==1?'运动':'静止'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="步数" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.stepNum}}
                                </template>
                            </el-table-column>
                            <el-table-column label="电压" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.batteryVol}}
                                </template>
                            </el-table-column>
                            <el-table-column label="macs地址" width="700">
                                <template slot-scope="scope">
                                    {{scope.row.macs}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import {mapState} from 'vuex'
    export default{
        name:'locationMessage',
        computed:{
            ...mapState({user:'user',adminRoles:'roles'})
        },
        data(){
            return {
                roles:this.$store.getters.roles,
                listLoading:false,
                imei:'',
                list:[],
                height:0,
                startTime:'',
                endTime:'',
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-235
            this.endTime=new Date()
        },
        methods:{
            async getHistory(){
                if(!this.imei||!this.startTime||!this.endTime || new Date(this.startTime)>new Date(this.endTime)){
                    this.$message.warning('输入有误');
                    return
                }
                this.listLoading=true
                this.list=[]
                let id=await api.getEquList(this.imei).catch(_=>{
                    this.listLoading=false
                    this.$message.error('查找设备失败');
                    return []
                })
                if(id.length===0){
                    this.listLoading=false
                    return this.$message.error('该设备不存在');
                }
                api.getHistory(id[0].id,{startTime:this.startTime,endTime:this.endTime}).then(res=>{
                    let list=[]
                    this.listLoading=false
                    res.sort((a,b)=>new Date(a.eventTime).getTime()-new Date(b.eventTime).getTime())
                    this.list=res

                }).catch(err=>{
                    this.listLoading=false
                    this.$message({
                        type: 'error',
                        message: '请求错误!'
                    });
                })
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>