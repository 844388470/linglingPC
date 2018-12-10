<template>
    <div id="group" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入分组名称"></el-input>
                </el-col>
                <el-col :span="16">
                    <el-button @click="filterSearch">查找</el-button>
                    <el-button @click="changeindex(1)">刷新</el-button>
                    <el-button @click="openDialogs(false)">新建</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="always" :style="'height:'+windowHeight+'px'">
            <div :style="{height:windowHeight-40+'px',overflow:'hidden' }">
                <el-scrollbar :style="{height:windowHeight-23+'px' }" ref="scroll">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="listxian"
                            style="width: 100%">
                            <el-table-column
                                prop="name"
                                label="分组名称">
                            </el-table-column>
                            <el-table-column 
                                label="ID">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column 
                                label="上级分组ID">
                                <template slot-scope="scope">
                                    {{scope.row.parent_id || '无上级分组'}}
                                </template>
                            </el-table-column>
                            <el-table-column 
                                label="管理员ID">
                                <template slot-scope="scope">
                                    {{scope.row.user_id || '无管理员'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="360"> 
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    @click="openDialog(scope.row.id)">查看归属设备</el-button>
                                    <el-button
                                    size="mini"
                                    v-if="scope.row.id==user||(adminRoles==99&&scope.row.role!==99)||(adminRoles==88&&scope.row.role!==99&&scope.row.role!==88)"
                                    @click="openDialogs(true,scope.row)">编辑</el-button>
                                    <el-button
                                    size="mini"
                                    v-if="scope.row.id==user||(adminRoles==99&&scope.row.role!==99)||(adminRoles==88&&scope.row.role!==99&&scope.row.role!==88)"
                                    @click="deleteGroup(scope.row.id)">删除</el-button>
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
            <div :style="{height:'500px',overflow:'hidden' }" v-loading="bindListLoading">
                <el-scrollbar :style="{height:400+17+'px'}">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="bindList"
                            style="width: 100%">
                            <el-table-column
                                prop="imei"
                                label="imei">
                            </el-table-column>
                            <el-table-column label="ID" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column label="管理员ID"  width="140">
                                <template slot-scope="scope">
                                    {{scope.row.admin_id}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                label="创建时间">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    @click="deleteGroupEqu(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
                <div class="hideScrollbarButtom"></div>
                <el-pagination
                    @current-change="equChangeIndex"
                    :current-page.sync="equIndex"
                    :page-size="50"
                    layout="total, prev, pager, next ,jumper"
                    :total="equTotal">
                </el-pagination>
            </div>
        </el-dialog>
        <el-dialog
            :title="isEdit?'修改':'新增'"
            :visible.sync="dialogStates"
            width="30%"
            :before-close="handleCloses">
            <div>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <label class="el-form-item__label">分组名称:</label>
                        <el-input v-model="name"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">上级分组ID:</label>
                        <el-input v-model="parent_id"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label class="el-form-item__label">管理员ID:</label>
                        <el-input v-model="user_id"></el-input>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloses">取 消</el-button>
                <el-button type="primary" @click="confirmAdd" :loading="addOrEditLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import {mapState} from 'vuex'
    export default{
        name:'group',
        mixins:[mixin],
        computed:{
            ...mapState({user:'user',adminRoles:'roles'})
        },
        data(){
            return {
                windowHeight:0,
                list:[],
                listLoading:false,
                addOrEditLoading:false,
                listxian:[],
                search:'',
                name:'',
                parent_id:'',
                user_id:'',
                dialogState:false,
                dialogStates:false,
                isEdit:false,
                editId:-1,
                id:-1,
                bindList:[],    
                bindListLoading:false,
                equTotal:0,
                equIndex:1,
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
                this.rollBack('scroll')
                api.getGroupListPagination({pageSize:this.page.size,offset:this.page.index-1}).then(_=>{
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
            getBindList(id){
                this.bindListLoading=true
                api.getEquListPagination({
                    pageSize:50,
                    offset:this.equIndex-1,
                    columns:[
                        {name:'group_id',value:this.id}
                    ]
                }).then(_=>{
                    if(Array.isArray(_.data)){
                        this.bindList=_.data
                        this.equTotal=_.page.count
                    }else{
                        this.$message.error('获取列表失败');
                    }
                    this.bindListLoading=false
                }).catch(_=>{
                    this.$message.error('获取列表失败');
                    this.bindListLoading=false
                })
            },
            equChangeIndex(val){
                this.equIndex=val
                try{
                    this.getBindList()
                }catch(res){
                    
                }
            },
            filterSearch(){
                this.listLoading=true
                if(this.search){
                    api.getGroupList({name:this.search}).then(_=>{
                        if(Array.isArray(_)){
                            this.listxian=_
                            this.page.total=_.length
                            // this.page.size=_.length
                        }else{
                            this.$message.error('查找失败');
                        }
                        this.listLoading=false
                    }).catch(_=>{
                        this.$message.error('查找失败');
                        this.listLoading=false
                    })
                }else{
                    this.changeindex(1)
                }
            },
            openDialog(id){
                this.id=id
                this.dialogState=true
                this.getBindList()
            },
            openDialogs(state,obj){
                if(state){
                    this.name=obj.name
                    this.parent_id=obj.parent_id
                    this.user_id=obj.user_id
                    this.editId=obj.id
                }else{
                    this.name=''
                    this.parent_id=''
                    this.user_id=''
                    this.editId=-1
                }
                this.isEdit=state
                this.dialogStates=true
            },
            async confirmAdd(){
                let data={
                    'name':this.name,
                    'parent_id':this.parent_id || null,
                    'user_id':this.user_id || null,
                }
                this.addOrEditLoading=true
                let res=null
                if(this.isEdit){
                    res=await api.groupEdit(this.editId,data).catch(_=>{
                        
                    })
                }else{
                    res=await api.groupAdd(data).catch(_=>{
                        
                    })
                }
                if(res&&(res.affectedRows||res.affectedRows===0||res.id)){
                    this.$message({
                        type: 'success',
                        message: `${this.isEdit?'修改成功':'添加成功'}`
                    });
                    this.dialogStates=false
                    this.getList()
                    this.addOrEditLoading=false
                }else{
                    this.$message({
                        type: 'error',
                        message: `${this.isEdit?'修改失败':'添加失败'}`
                    });
                    this.addOrEditLoading=false
                }
            },
            deleteGroupEqu(id){
                this.$confirm('是否确定将该设备移出分组?', '提示', {
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
            deleteGroup(id){
                this.$confirm('删除分组后无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.groupDelete(id).then(_=>{
                        if(_.success){
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
    .hideScrollbarButtom{
        height: 17px;
        width: 100%;
        position: relative;
        top: -17px;
        background-color: #fff;
    }
</style>