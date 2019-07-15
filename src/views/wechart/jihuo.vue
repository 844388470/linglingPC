<template>
    <div id="jihuo" v-loading="listLoading">
        
        <!-- <el-card style="widht:20%">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-card> -->
        
        <el-card shadow="always" :style="'height:'+height+'px','line-height:40px;'">
            <!-- <div style="width:10%;float:left;text-line:100%;">
            <h5>客户目录</h5>
        </div> -->
            <!-- <el-card shadow="always" class="mb20"> -->
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入设备imei号"></el-input>
                </el-col>
                <el-col :span="16">
                      <el-button @click="filterSearch">查找</el-button>
                      <el-button @click="refresh">刷新</el-button>
                      <el-button @click="openDialog(false)" >添加</el-button>
                </el-col>
            </el-row>
        <!-- </el-card> -->
            <!-- <div style="width:10%;float:left;">
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div> -->
            <div :style="{height:height+'px',overflow:'hidden' }">
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
                                label="类型">
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
                                    <!-- <el-button
                                    v-if="scope.row.bind_mode!==1"
                                    size="mini"
                                    @click="changeBindModel(scope.row.id)">切换</el-button> -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="[0,1].filter(res=>res==roles).length!==0?'更新时间':'归属分组'">
                                <template slot-scope="scope">
                                    {{[0,1].filter(res=>res==roles).length!==0?scope.row.update_date:scope.row.group_id}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    @click="openDialog(true,scope.row)">编辑</el-button>
                                    <el-button
                                    v-if="[88,99].filter(res=>res==roles).length"
                                    size="mini"
                                    @click="deleteEqu(scope.row.id)">删除</el-button>
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
            :title="isEdit?'修改':'新增'"
            :visible.sync="dialogState"
            width="30%"
            :before-close="handleClose">
            <div>
                <label class="el-form-item__label">imei:</label>
                <el-input v-model="imei" :disabled="[0,1].filter(res=>res==roles).length!==0"></el-input>
                <label class="el-form-item__label">imsi:</label>
                <el-input v-model="imsi"></el-input>
                <label class="el-form-item__label" v-if="isEdit">电信id:</label>
                <el-input  v-if="isEdit" v-model="device_id" :disabled="isEdit"></el-input>
                <label class="el-form-item__label">绑定模式:</label>
                <div style="width: 100%;display: inline-block;position: relative;">
                    <el-radio v-model="bind_mode" label="1">允许任何人</el-radio>
                    <el-radio v-model="bind_mode" label="0" v-if="[0,1].filter(res=>res==roles).length===0">管理员审核</el-radio>
                    <el-radio v-model="bind_mode" label="2">拒绝任何人</el-radio>
                </div>
                <label class="el-form-item__label" v-if="[0,1].filter(res=>res==roles).length===0">设备类型:</label>
                <el-input  v-model="model" v-if="[0,1].filter(res=>res==roles).length===0"></el-input>
                <label class="el-form-item__label">设备名称:</label>
                <el-input  v-model="name"></el-input>
                <label class="el-form-item__label"  v-if="[88,99].filter(res=>res==roles).length!==0">归属分组:</label>
                <el-input  v-model="group_id"  v-if="[88,99].filter(res=>res==roles).length!==0"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <!-- <el-button type="primary" @click="confirmAdd" :disabled="[0,1].filter(res=>res==roles).length!==0 && isEdit" :loading="addOrEditLoading">{{[0,1].filter(res=>res==roles).length!==0 && isEdit?'无修改权限':'确认'}}</el-button> -->
                <el-button type="primary" @click="confirmAdd"  :loading="addOrEditLoading">{{'确认'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import {mapState} from 'vuex'
    export default{
        name:'jihuo',
        mixins:[mixin],
        computed:{
            ...mapState({user:'user',adminRoles:'roles'})
        },
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
                imsi:'',
                device_id:'',
                bind_mode:'',
                group_id:'',
                model:'',
                name:'',
                dialogState:false,
                isEdit:false,
                editId:-1,
                group_id:0, data: [{
          label: '瑞章',
          children: [{
            label: 'D601',
            children: [{
              label: '测试设备'
            }]
          }]
        }, {
          label: '客户B',
          children: [{
            label: 'D603'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-330
            console.log("当前数据"+this.page.size)
            this.getList()
        },
        methods:{
            getGroupList(){
                this.listLoading=true
                api.getGroupList({user_id:this.user}).then(res=>{
                    if(res.length){
                        api.getEquListPagination({
                            pageSize:this.page.size,
                            offset:this.page.index-1,
                            columns:this.search?[
                                {name:'group_id',value:res[0].id},
                                {name:'imei',value:this.search}
                            ]:[{name:'group_id',value:res[0].id},]
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
                    }else{
                        this.page.total=0
                        this.listxian=[]
                        this.listLoading=false
                    }
                }).catch(err=>{
                    this.$message.error('获取列表失败');
                    this.listLoading=false
                })
            },
            getAllList(){
                this.listLoading=true
                api.getEquListPagination({
                    pageSize:this.page.size,
                    offset:this.page.index-1,
                    columns:this.search?[
                        {name:'imei',value:this.search}
                    ]:[]
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
            getList(){
                
                if([0,1].indexOf(Number(this.adminRoles))!==-1){
                    this.getGroupList()
                }else{
                    this.getAllList()
                }
            },
            filterSearch(){
                this.page.index=1
                this.getList()
            },
            refresh(){
                this.page.index=1
                this.search=''
                this.getList()
            },
            openDialog(state,obj){
                if(state){
                    this.imei=obj.imei
                    this.imsi=obj.imsi
                    this.device_id=obj.device_id
                    this.bind_mode=obj.bind_mode+''
                    this.model=obj.model
                    this.name=obj.name
                    this.group_id=obj.group_id
                    this.editId=obj.id
                }else{
                    this.imei=''
                    this.imsi=''
                    this.device_id=''
                    this.bind_mode=''
                    this.model=''
                    this.name=''
                    this.group_id=''
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
                if(this.isEdit){
                    let data={
                        imei:this.imei,
                        imsi:this.imsi,
                        device_id:this.device_id,
                        bind_mode:this.bind_mode,
                        model:this.model,
                        name:this.name,
                        model:this.model,
                        group_id:this.group_id
                    }
                    this.addOrEditLoading=true
                    api.equEdit(this.editId,data).then(_=>{
                        if(_){
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
                    if(this.list.filter(obj=>obj.imei==this.imei).length){
                        this.$message({
                            type: 'warning',
                            message: '该imei已存在!'
                        });
                        return
                    }
                    let data={
                        imei:this.imei,
                        imsi:this.imsi,
                        bind_mode:this.bind_mode,
                        model:this.model,
                        name:this.name,
                        model:this.model,
                        group_id:this.group_id
                    }
                    this.addOrEditLoading=true
                    api.equAdd(data).then(_=>{
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
                    api.equDelete(id).then(_=>{
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
                    if(_){
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