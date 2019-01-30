<template>
    <div id="policeMessage" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="imei" placeholder="请输入设备imei号"></el-input>
                </el-col>
                <el-col :span="16">
                      <el-button @click="filterSearch()">查找</el-button>
                      <!-- <el-button @click="filterSearch">刷新</el-button> -->
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="always" :style="'height:'+height+'px'">
            <div :style="{height:height-40+'px',overflow:'hidden' }">
                <el-scrollbar :style="{height:height-23+'px' }">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="listxian"
                            :height="height-40"
                            style="width: 100%">
                            <el-table-column
                                prop="id"
                                width="100"
                                label="消息ID">
                            </el-table-column>
                            <el-table-column
                                prop="did"
                                width="120"
                                label="设备ID">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                width="100"
                                label="status" >
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                width="100"
                                label="type">
                            </el-table-column>
                            <el-table-column
                                prop="user_id"
                                width="100"
                                label="user_id">
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                width="200"
                                label="创建日期">
                            </el-table-column>
                            <el-table-column
                                prop="update_date"
                                width="200"
                                label="更新日期">
                            </el-table-column>
                            <el-table-column
                                prop="message"
                                width="600"
                                label="消息内容">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
        <el-card shadow="always" class="mt20">
            <el-pagination
                @current-change="changeindex"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next ,jumper"
                :total="page.total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    export default{
        name:'policeMessage',
        mixins:[mixin],
        data(){
            return {
                types:process.env.type,
                roles:this.$store.getters.roles,
                height:0,
                list:[],
                listLoading:false,
                listxian:[],
                imei:'',
            }
        },
        activated(){
            // console.log('进入了')
        },
        deactivated(){
            // console.log('离开了')
        },
        mounted(){
            // this.height=document.body.offsetHeight-235
            this.height=document.body.offsetHeight-330
            // this.getList()
        },
        methods:{
            getLists(){
                this.listLoading=true
                var columns=[]
                if(this.search){
                    columns.push({name:'imei',value:this.search})
                }
                if(this.searchType){
                    columns.push({name:'type',value:this.searchType})
                }
                api.getzhucheListPagination({
                    pageSize:this.page.size,
                    offset:this.page.index-1,
                    columns:columns
                }).then(_=>{
                    if(Array.isArray(_.data)){
                        this.list=_.data
                        this.listxian=_.data
                        this.page.total=_.page.count
                    }else{
                        this.$message.error('获取列表失败');
                    }
                    this.listLoading=false
                }).catch(_=>{
                    this.$message.error('获取列表失败');
                    this.listLoading=false
                })
            },
            filterSearch(){
                this.page.index=1
                // this.imei=''
                this.getList()
            },
            async getList(){
                if(!this.imei){
                    this.$message.warning('请输入imei号');
                    return
                }
                this.listLoading=true
                this.listxian=[]
                let id=await api.getEquList(this.imei).catch(_=>{
                    this.listLoading=false
                    this.$message.error('查找设备失败');
                    return []
                })
                if(id.length===0){
                    this.listLoading=false
                    return this.$message.error('该设备不存在');
                }
                api.getMessageListPagination(id[0].id,{
                    pageSize:50,
                    offset:this.page.index-1,
                }).then(res=>{
                    this.listLoading=false
                    this.listxian=res.data
                    this.page.total=res.page.count
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