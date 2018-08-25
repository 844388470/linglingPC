<template>
    <div id="jihuo" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入用户名"></el-input>
                </el-col>
                <el-col :span="16">
                      <el-button @click="filterSearch">查找</el-button>
                      <el-button @click="getList">刷新</el-button>
                      <!-- <el-button @click="openDialog(false)">注册</el-button> -->
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="always" :style="'height:'+height+'px'">
            <div :style="{height:height-40+'px',overflow:'hidden' }">
                <el-scrollbar :style="{height:height-23+'px' }">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="listxian"
                            style="width: 100%">
                            <el-table-column
                                prop="nickname"
                                label="微信昵称">
                            </el-table-column>
                            <el-table-column label="id">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="phone"
                                label="电话">
                            </el-table-column>
                            <el-table-column
                                prop="height"
                                label="身高">
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                label="创建时间">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    @click="openDialog(scope.row.id)">查看绑定记录</el-button>
                                    <!-- <el-button
                                    v-if="roles=='admin'"
                                    size="mini"
                                    @click="deleteEqu(scope.row.id)">删除</el-button> -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
        <el-dialog
            title="绑定记录"
            :visible.sync="dialogState"
            width="60%"
            :before-close="handleClose">
            <div :style="{height:'400px',overflow:'hidden' }" v-loading="bindListLoading">
                <el-scrollbar :style="{height:400+17+'px' }">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="bindList"
                            style="width: 100%">
                            <el-table-column
                                prop="imei"
                                label="imei">
                            </el-table-column>
                            <el-table-column label="id" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column label="状态"  width="140">
                                <template slot-scope="scope">
                                    {{scope.row.status==9?'绑定成功':scope.row.status==1?'等待设备响应':scope.row.status==2?'绑定超时':scope.row.status==3?'等待管理员确认':scope.row.status==5?'管理员拒绝':''}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                label="创建时间">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    v-if="scope.row.status==3"
                                    size="mini"
                                    @click="deleteBindRecord(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    export default{
        name:'jihuo',
        data(){
            return {
                roles:this.$store.getters.roles,
                height:0,
                list:[],
                listLoading:false,
                addOrEditLoading:false,
                listxian:[],
                search:'',
                imei:'',
                type:'',
                dialogState:false,
                isEdit:false,
                editId:-1,
                id:-1,
                bindList:[],
                bindListLoading:false,
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-235
            this.getList()
        },
        methods:{
            getList(){
                this.listLoading=true
                api.getUsersList().then(_=>{
                    if(Array.isArray(_)){
                        this.list=_
                        this.filterSearch()
                    }else{
                        this.$message.error('获取列表失败');
                    }
                    this.listLoading=false
                }).catch(_=>{
                    this.$message.error('获取列表失败');
                    this.listLoading=false
                })
            },
            getBindList(id){
                this.bindListLoading=true
                api.getBindList(id).then(_=>{
                    if(Array.isArray(_)){
                        this.bindList=_
                    }else{
                        this.$message.error('获取列表失败');
                    }
                    this.bindListLoading=false
                }).catch(_=>{
                    this.$message.error('获取列表失败');
                    this.bindListLoading=false
                })
            },
            filterSearch(){
                this.listxian=this.list.filter(obj=>obj.nickname&&obj.nickname.indexOf(this.search)!==-1)
            },
            openDialog(id){
                this.id=id
                this.dialogState=true
                this.getBindList(id)
            },
            confirmAdd(){
                if(this.imei.length=='' || this.type==''){
                    this.$message({
                        type: 'warning',
                        message: '输入不得为空!'
                    });
                    return 
                }
                if(this.list.filter(obj=>obj.imei==this.imei).length){
                    this.$message({
                        type: 'warning',
                        message: '该imei已存在!'
                    });
                    return
                }
                if(this.isEdit){
                    let data={
                        imei:this.imei,
                        iccid:this.imei,
                        type:this.type,
                        model:this.type,
                        manufacturer_name:'Rinlink',
                        manufacturer_id:'Rinlink'
                    }
                    this.addOrEditLoading=true
                    api.zhucheEdit(this.editId,data).then(_=>{
                        if(_.affectedRows){
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.dialogState=false
                            this.getList()
                            this.addOrEditLoading=false
                        }else{
                            return Promise.reject()
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: '修改失败!'
                        });
                        this.addOrEditLoading=false
                    })
                }else{
                    let data={
                        imei:this.imei,
                        iccid:this.imei,
                        type:this.type,
                        model:this.type,
                        manufacturer_name:'Rinlink',
                        manufacturer_id:'Rinlink'
                    }
                    this.addOrEditLoading=true
                    api.zhucheAdd(data).then(_=>{
                        if(_.id){
                            this.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                            this.dialogState=false
                            this.getList()
                            this.addOrEditLoading=false
                        }else{
                            return Promise.reject()
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: '添加失败!'
                        });
                        this.addOrEditLoading=false
                    })
                }
            },
            deleteBindRecord(id){
                this.$confirm('删除后无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.bindListLoading=true
                    api.deleteBindRecord(id).then(_=>{
                        if(_.affectedRows){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getBindList(this.id)
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
                    })
                }).catch(() => {
                    this.bindListLoading=false
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            handleClose(){
                this.dialogState=false
            },
            changeBindModel(id){
                api.equEdit(id,{bind_mode:1}).then(_=>{
                    if(_.affectedRows){
                        this.$message({
                            type: 'success',
                            message: '切换成功!'
                        });
                        this.getList()
                    }else{
                        return Promise.reject()
                    }
                }).catch(_=>{
                    this.$message({
                        type: 'error',
                        message: '切换删除!'
                    }); 
                })
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>