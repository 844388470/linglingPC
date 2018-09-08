<template>
    <div id="user" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入用户名"></el-input>
                </el-col>
                <el-col :span="16">
                      <el-button @click="filterSearch">查找</el-button>
                      <el-button @click="getList">刷新</el-button>
                      <el-button @click="openDialogs(false)">注册</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="always" :style="'height:'+windowHeight+'px'">
            <div :style="{height:windowHeight-40+'px',overflow:'hidden' }">
                <el-scrollbar :style="{height:windowHeight-23+'px' }">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="listxian"
                            style="width: 100%">
                            <el-table-column
                                prop="username"
                                label="账号">
                            </el-table-column>
                            <el-table-column label="id">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="role"
                                label="权限">
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                label="创建时间">
                            </el-table-column>
                            <el-table-column label="操作" width="300"> 
                                <template slot-scope="scope">
                                    <el-button
                                    v-if="roles=='admin'"
                                    size="mini"
                                    @click="openDialogs(true,scope.row)">编辑</el-button>
                                    <el-button
                                    v-if="roles=='admin'"
                                    size="mini"
                                    @click="deleteUser(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
        <el-dialog
            :title="isEdit?'修改':'新增'"
            :visible.sync="dialogStates"
            width="30%"
            :before-close="handleCloses">
            <div>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <label class="el-form-item__label">账号:</label>
                        <el-input v-model="username" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                    <el-col :span="24">
                        <label class="el-form-item__label">密码:</label>
                        <el-input v-model="password" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="confirmAdd" :disabled="!(roles=='admin' || !isEdit)" :loading="addOrEditLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    export default{
        name:'user',
        data(){
            return {
                roles:this.$store.getters.roles,
                windowHeight:0,
                list:[],
                listLoading:false,
                addOrEditLoading:false,
                listxian:[],
                search:'',
                username:'',
                password:'',
                dialogState:false,
                dialogStates:false,
                isEdit:false,
                editId:-1,
                id:-1,
                bindList:[],
                bindListLoading:false,
            }
        },
        mounted(){
            this.windowHeight=document.body.offsetHeight-235
            this.getList()
        },
        methods:{
            getList(){
                this.search=''
                this.listLoading=true
                api.getUsersList().then(_=>{
                    if(Array.isArray(_)){
                        this.list=_.filter(obj=>obj.username)
                        console.log(this.list)
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
                this.listxian=this.list.filter(obj=>obj.username&&obj.username.indexOf(this.search)!==-1)
            },
            openDialog(id){
                this.id=id
                this.dialogState=true
                this.getBindList(id)
            },
            openDialogs(state,obj){
                if(state){
                    this.username=obj.username
                    // this.nickname=obj.nickname
                    // this.phone=obj.phone
                    // this.email=obj.email
                    // this.height=obj.height
                    // this.weight=obj.weight
                    // this.sport_target=obj.sport_target
                    // this.editId=obj.id
                }else{
                    this.username=''
                    this.password=''
                    this.editId=-1
                }
                this.isEdit=state
                this.dialogStates=true
            },
            confirmAdd(){
                if(this.isEdit){
                    let data={
                        'username':this.username,
                        'password':this.password
                    }
                    this.addOrEditLoading=true
                    api.userEdit(this.editId,data).then(_=>{
                        if(_.affectedRows){
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.dialogStates=false
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
                        'username':this.username,
                        'password':this.password
                    }
                    this.addOrEditLoading=true
                    api.userRegister(data).then(_=>{
                        if(_.id){
                            this.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                            this.dialogStates=false
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
            deleteUser(id){
                this.$confirm('删除后无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.userDelete(id).then(_=>{
                        if(_.affectedRows){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getList()
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            handleClose(){
                this.dialogState=false
            },
            handleCloses(){
                this.dialogStates=false
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>