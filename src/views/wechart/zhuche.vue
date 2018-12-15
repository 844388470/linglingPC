<template>
    <div id="zhuche" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入设备imei号"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="searchType" placeholder="请输入设备类型"></el-input>
                </el-col>
                <el-col :span="16">
                      <el-button @click="getList()">查找</el-button>
                      <el-button @click="filterSearch">刷新</el-button>
                      <el-button @click="openDialog(false)">注册</el-button>
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
                                prop="type"
                                 width="120"
                                label="设备类型">
                            </el-table-column>
                            <el-table-column
                                prop="model"
                                 width="120"
                                label="设备型号">
                            </el-table-column>
                            <el-table-column
                                prop="id"
                                width="100"
                                label="id">
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                label="创建日期">
                            </el-table-column>
                            <el-table-column
                                prop="update_date"
                                label="更新日期">
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
                                    <el-button
                                    v-if="[99].filter(res=>res==roles).length"
                                    size="mini"
                                    @click="jihuo(scope.row.imei)">激活</el-button>
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
                <el-input v-model="imei"></el-input>
                <label class="el-form-item__label">iccid:</label>
                <el-input v-model="iccid"></el-input>
                <label class="el-form-item__label">type:</label>
                <el-input v-model="type" v-if="[99].filter(res=>res==roles).length"></el-input>
                <div style="width: 100%;display: inline-block;position: relative;"  v-if="[99].filter(res=>res==roles).length==0&&types.indexOf('cs')!==-1">
                    <el-radio v-model="type" label="D601testP2">D601</el-radio>
                    <el-radio v-model="type" label="D603testP2">D603</el-radio>
                    <el-radio v-model="type" label="D606test">D606</el-radio>
                    <el-radio v-model="type" label="D608test">D608</el-radio>
                </div>
                <div style="width: 100%;display: inline-block;position: relative;"  v-if="[99].filter(res=>res==roles).length==0&&types.indexOf('zs')!==-1">
                    <el-radio v-model="type" label="D601testP3">D601</el-radio>
                    <el-radio v-model="type" label="D603testP3">D603</el-radio>
                    <el-radio v-model="type" label="D606testP3">D606</el-radio>
                    <el-radio v-model="type" label="D608testP3">D608</el-radio>
                </div>
                <label class="el-form-item__label" v-if="[99].filter(res=>res==roles).length">model:</label>
                <el-input v-model="model" v-if="[99].filter(res=>res==roles).length"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="confirmAdd" :disabled="[0,1].filter(res=>res==roles).length!==0 && isEdit" :loading="addOrEditLoading">{{[0,1].filter(res=>res==roles).length!==0 && isEdit?'无修改权限':'确认'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    export default{
        name:'zhuche',
        mixins:[mixin],
        data(){
            return {
                types:process.env.type,
                roles:this.$store.getters.roles,
                selects:[{name:'D601',id:'D601testP2'},{name:'D603',id:'D603testP2'},{name:'D608',id:'D608test'}],
                // selects:[{name:'D601',id:'D601testP2'},{name:'D603',id:'D603testP2'},{name:'D608',id:'D608test'}],
                height:0,
                list:[],
                listLoading:false,
                addOrEditLoading:false,
                listxian:[],
                search:'',
                searchType:'',
                imei:'',
                iccid:'',
                type:'',
                model:'',
                dialogState:false,
                isEdit:false,
                editId:-1
            }
        },
        activated(){
            // console.log('进入了')
        },
        deactivated(){
            // console.log('离开了')
        },
        mounted(){
            console.log(this.types)
            this.height=document.body.offsetHeight-330
            this.getList()
        },
        methods:{
            getList(){
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
                this.search=''
                this.searchType=''
                this.getList()
            },
            openDialog(state,obj){
                if(state){
                    this.imei=obj.imei
                    this.iccid=obj.iccid
                    this.type=obj.type
                    this.model=obj.model
                    this.editId=obj.id
                }else{
                    this.imei=''
                    this.iccid=''
                    this.type=''
                    this.model=''
                    this.editId=-1
                }
                this.isEdit=state
                this.dialogState=true
            },
            jihuo(imei){
                this.listLoading=true
                api.addCoor(imei).then(_=>{
                    api.relieveCoor(this.$store.getters.user,_.did).then(_=>{
                        this.$message.success('激活成功');
                        this.listLoading=false
                    }).catch(_=>{
                        this.$message.error(_.message);
                        this.listLoading=false
                    })
                }).catch(_=>{
                    this.$message.error(_.message);
                    this.listLoading=false
                })
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
                        iccid:this.iccid,
                        type:this.type,
                        model:this.model,
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
                    if(this.list.filter(obj=>obj.imei==this.imei).length){
                        this.$message({
                            type: 'warning',
                            message: '该imei已存在!'
                        });
                        return
                    }
                    let data={
                        imei:this.imei,
                        iccid:this.imei,
                        type:this.type,
                        model:this.model,
                        manufacturer_name:'Rinlink',
                        manufacturer_id:'Rinlink'
                    }
                    if(this.roles!=='admin'){
                        data.type=this.type
                        data.model=this.type
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
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>