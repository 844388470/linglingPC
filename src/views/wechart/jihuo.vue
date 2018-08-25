<template>
    <div id="jihuo" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入设备imei号"></el-input>
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
                                prop="imei"
                                label="imei">
                            </el-table-column>
                            <el-table-column
                                prop="model"
                                 width="120"
                                label="型号">
                            </el-table-column>
                            <el-table-column
                                prop="id"
                                width="100"
                                label="id">
                            </el-table-column>
                            <el-table-column
                                prop="admin_id"
                                width="100"
                                label="管理员id">
                            </el-table-column>
                            <el-table-column label="绑定设置">
                                <template slot-scope="scope">
                                    {{scope.row.bind_mode===0?'管理员确认':scope.row.bind_mode===1?'允许任何人':'拒绝任何人'}}
                                    <el-button
                                    v-if="scope.row.bind_mode!==1"
                                    size="mini"
                                    @click="changeBindModel(scope.row.id)">切换</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                label="创建日期">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <!-- <el-button
                                    size="mini"
                                    @click="openDialog(true,scope.row)">编辑</el-button> -->
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
            :title="isEdit?'修改':'新增'"
            :visible.sync="dialogState"
            width="30%"
            :before-close="handleClose">
            <div>
                <label class="el-form-item__label">imei:</label>
                <el-input v-model="imei" :disabled="!(roles=='admin' || !isEdit)"></el-input>
                <label class="el-form-item__label">type:</label>
                <div style="width: 100%;display: inline-block;position: relative;">
                    <el-radio v-model="type" label="d601" :disabled="!(roles=='admin' || !isEdit)">d601</el-radio>
                    <el-radio v-model="type" label="D606" :disabled="!(roles=='admin' || !isEdit)">D606</el-radio>
                    <el-radio v-model="type" label="D601003" :disabled="!(roles=='admin' || !isEdit)">D601003</el-radio>
                </div>
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
                editId:-1
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-235
            this.getList()
        },
        methods:{
            getList(){
                this.listLoading=true
                api.getEquList().then(_=>{
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
            filterSearch(){
                this.listxian=this.list.filter(obj=>obj.imei.indexOf(this.search)!==-1)
            },
            openDialog(state,obj){
                if(state){
                    this.imei=obj.imei
                    this.type=obj.type
                    this.editId=obj.id
                }else{
                    this.imei=''
                    this.type=''
                    this.editId=-1
                }
                this.isEdit=state
                this.dialogState=true
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
            deleteEqu(id){
                this.$confirm('删除后无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(123)
                    api.zhucheDelete(id).then(_=>{
                        if(_.affectedRows){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getList()
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'danger',
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