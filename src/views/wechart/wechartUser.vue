<template>
    <div id="wechartUser" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入昵称"></el-input>
                </el-col>
                <el-col :span="16">
                      <el-button @click="filterSearch">查找</el-button>
                      <el-button @click="changeindex(1)">刷新</el-button>
                      <el-button v-if="roles=='admin'" @click="openDialogs(false)">注册</el-button>
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
                                prop="nickname"
                                label="昵称">
                            </el-table-column>
                            <el-table-column
                                prop="username"
                                label="登录账号">
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
                            <!-- <el-table-column
                                prop="height"
                                label="身高">
                            </el-table-column> -->
                            <el-table-column
                                prop="create_date"
                                label="创建时间">
                            </el-table-column>
                            <el-table-column label="操作" width="360"> 
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    @click="openDialog(scope.row.id)">查看绑定记录</el-button>
                                    <el-button
                                    v-if="roles=='admin'"
                                    size="mini"
                                    @click="openDialogs(true,scope.row)">编辑</el-button>
                                    <el-button
                                    v-if="roles=='admin'"
                                    size="mini"
                                    @click="pcOpenDialogs(true,scope.row)">修改登录</el-button>
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
        <el-card shadow="always" class="mt20">
            <el-pagination
                @current-change="changeindex"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next ,jumper"
                :disabled="search?true:false"
                :total="page.total">
            </el-pagination>
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
        <el-dialog
            :title="isEdit?'修改':'新增'"
            :visible.sync="dialogStates"
            width="60%"
            :before-close="handleCloses">
            <div>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <label class="el-form-item__label">昵称:</label>
                        <el-input v-model="nickname" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">姓名:</label>
                        <el-input v-model="name" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">电话:</label>
                        <el-input v-model="phone" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">邮箱:</label>
                        <el-input v-model="email" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">身高(m):</label>
                        <el-input v-model="height" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">体重(kg):</label>
                        <el-input v-model="weight" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">运动目标(步):</label>
                        <el-input v-model="sport_target" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloses">取 消</el-button>
                <el-button type="primary" @click="confirmAdd" :disabled="!(roles=='admin' || !isEdit)" :loading="addOrEditLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="pcIsEdit?'修改':'新增'"
            :visible.sync="pcDialogStates"
            width="30%"
            :before-close="pcHandleCloses">
            <div>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <label class="el-form-item__label">账号:</label>
                        <el-input v-model="username" :disabled="!(roles=='admin' || !pcIsEdit)"></el-input>
                    </el-col>
                    <el-col :span="24">
                        <label class="el-form-item__label">密码:</label>
                        <el-input v-model="password" :disabled="!(roles=='admin' || !pcIsEdit)"></el-input>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pcHandleCloses">取 消</el-button>
                <el-button type="primary" @click="pcConfirmAdd" :disabled="!(roles=='admin' || !pcIsEdit)" :loading="pcAddOrEditLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    export default{
        name:'wechartUser',
        mixins:[mixin],
        data(){
            return {
                username:'',
                password:'',
                roles:this.$store.getters.roles,
                windowHeight:0,
                list:[],
                listLoading:false,
                addOrEditLoading:false,
                pcAddOrEditLoading:false,
                listxian:[],
                search:'',
                name:'',
                nickname:'',
                phone:'',
                email:'',
                height:'',
                weight:'',
                sport_target:'',
                dialogState:false,
                dialogStates:false,
                pcDialogStates:false,
                isEdit:false,
                pcIsEdit:false,
                editId:-1,
                pcEditId:-1,
                id:-1,
                bindList:[],
                bindListLoading:false,
            }
        },
        mounted(){
            this.windowHeight=document.body.offsetHeight-330
            this.getList()
        },
        methods:{
            getList(){
                this.search=''
                this.listLoading=true
                api.getUsersListPagination({pageSize:this.page.size,offset:this.page.index-1}).then(_=>{
                    if(Array.isArray(_.data)){
                        this.list=_.data
                        this.listxian=_.data
                        this.page.total=_.page.total
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
                this.listLoading=true
                api.getUsersList(this.search).then(_=>{
                    if(Array.isArray(_)){
                        this.listxian=_
                        this.page.total=_.length
                    }else{
                        this.$message.error('查找失败');
                    }
                    this.listLoading=false
                }).catch(_=>{
                    this.$message.error('查找失败');
                    this.listLoading=false
                })
            },
            openDialog(id){
                this.id=id
                this.dialogState=true
                this.getBindList(id)
            },
            openDialogs(state,obj){
                if(state){
                    this.name=obj.name
                    this.nickname=obj.nickname
                    this.phone=obj.phone
                    this.email=obj.email
                    this.height=obj.height
                    this.weight=obj.weight
                    this.sport_target=obj.sport_target
                    this.editId=obj.id
                }else{
                    this.name=''
                    this.nickname=''
                    this.phone=''
                    this.email=''
                    this.height=''
                    this.weight=''
                    this.sport_target=''
                    this.editId=-1
                }
                this.isEdit=state
                this.dialogStates=true
            },
            confirmAdd(){
                if(this.isEdit){
                    let data={
                        'name':this.name,
                        'nickname':this.nickname,
                        'phone':this.phone,
                        'email':this.email,
                        'height':this.height,
                        'weight':this.weight,
                        'sport_target':this.sport_target
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
                        'name':this.name,
                        'nickname':this.nickname,
                        'phone':this.phone,
                        'email':this.email,
                        'height':this.height,
                        'weight':this.weight,
                        'sport_target':this.sport_target
                    }
                    this.addOrEditLoading=true
                    api.userAdd(data).then(_=>{
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
            pcOpenDialogs(state,obj){
                if(state){
                    this.username=obj.username
                    this.password=''
                    this.pcEditId=obj.id
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
                    this.pcEditId=-1
                }
                this.pcIsEdit=state
                this.pcDialogStates=true
            },
            pcConfirmAdd(){
                if(this.pcIsEdit){
                    let data={
                        'username':this.username,
                        'password':this.password
                    }
                    this.pcAddOrEditLoading=true
                    api.userEdit(this.pcEditId,data).then(_=>{
                        if(_.affectedRows){
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.pcDialogStates=false
                            this.getList()
                            this.pcAddOrEditLoading=false
                        }else{
                            return Promise.reject()
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: '修改失败!'
                        });
                        this.pcAddOrEditLoading=false
                    })
                }else{
                    let data={
                        'username':this.username,
                        'password':this.password
                    }
                    this.pcAddOrEditLoading=true
                    api.userRegister(data).then(_=>{
                        if(_.id){
                            this.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                            this.pcDialogStates=false
                            this.getList()
                            this.pcAddOrEditLoading=false
                        }else{
                            return Promise.reject()
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: '添加失败!'
                        });
                        this.pcAddOrEditLoading=false
                    })
                }
            },
            pcHandleClose(){
                this.pcDialogState=false
            },
            pcHandleCloses(){
                this.pcDialogStates=false
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>