<template>
    <div  id="shebei" v-loading="listLoading">
        <el-card shadow="always" class="mb20">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入设备imei号"></el-input>
                </el-col>
                <el-col :span="16">
                      <!-- <el-button @click="getList()">查找</el-button> -->
                      <el-button @click="filterSearch">刷新</el-button>
                      <el-button @click="openDialog(false)" >添加</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
          <el-table :data="listxian" style="width: 100%">
            <el-table-column  prop="key" label="imei" width="330"></el-table-column>
            <el-table-column prop="id" label="id" width="200"></el-table-column>
            <el-table-column prop="createTm" label="添加时间" width="200"></el-table-column>
            <el-table-column prop="" label="操作" width="300">
              <template slot-scope="scope">
                <el-button size="mini"  @click="">编辑</el-button>
                <el-button size="mini"  @click="deleteEqu(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-dialog width="30%"  :visible.sync="dialogState">
          <el-form :model="form">
            <el-form-item label="imei" >
             <el-input v-model="imei" autocomplete="off"></el-input>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
    <el-button @click="dialogState = false">取 消</el-button>
    <el-button type="primary" @click="addlist()">确 定</el-button>
  </div>
        </el-dialog>
        <el-card shadow="always" class="mt20">
            <el-pagination
                @current-change="equChangeIndex"
                :current-page.sync="page.index"
                :page-size="15"
                layout="total, prev, pager, next ,jumper"
                :disabled="search?true:false"
                :total="page.total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
import api from "@/api/wechart";
import mixin from "@/mixins/index";
import { mapState } from "vuex";
export default {
  name: "shebei",
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      listLoading: false,
      types: process.env.type,
      roles: this.$store.getters.roles,
      selects: [
        { name: "D601", id: "D601testP2" },
        { name: "D603", id: "D603testP2" },
        { name: "D608", id: "D608test" }
      ],
      // selects:[{name:'D601',id:'D601testP2'},{name:'D603',id:'D603testP2'},{name:'D608',id:'D608test'}],
      height: 0,
      list: [],
      addOrEditLoading: false,
      listxian: [],
      search: "",
      searchType: "",
      imei: "",
      iccid: "",
      type: "",
      model: "",
      dialogState: false,
      isEdit: false,
      editId: -1,
      equIndex: 0,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  mounted() {
    //console.log(this.types)
    //this.height=document.body.offsetHeight-330
    this.getList();
  },
  methods: {
    getList() {
         this.listLoading=true
      //         var columns=[]
      //         if(this.search){
      //             columns.push({name:'imei',value:this.search})
      //         }
      //         if(this.searchType){
      //             columns.push({name:'type',value:this.searchType})
      //         }
      api
        .getlistnew(this.equIndex)
        .then(res => {
          if (Array.isArray(res.content)) {
            this.list = res.content;
            this.listxian = res.content;
            this.page.total = res.total;
          } else {
            this.$message.error("获取列表失败");
          }
          this.listLoading = false;
        })
        .catch(err => {
          this.$message.error("获取列表失败");
          this.listLoading = false;
        });
    },
    openDialog(state, obj) {
      if (state) {
        this.imei = obj.imei;
        // this.iccid=obj.iccid
        // this.type=obj.type
        // this.model=obj.model
        // this.editId=obj.id
      } else {
        this.imei = "";
        // this.iccid=''
        // this.type=''
        // this.model=''
        // this.editId=-1
      }
      this.isEdit = state;
      this.dialogState = true;
      console.log(state, this.isEdit);
    },
    equChangeIndex(val) {          //翻页
      console.log("页数" + val);
      this.equIndex = val - 1;
      try {
        this.getList();
      } catch (res) {}
    },

    filterSearch() {                 //页面刷新
      this.page.index = 1;
      this.search = "";
      this.searchType = "";
      this.getList();
    },
    addlist() {
      if (this.imei.length == "") {
        this.$message({
          type: "warning",
          message: "输入不得为空!"
        });
        return;
      }
      if (this.isEdit) {
        let data = {
          key: this.imei
        };
        this.addOrEditLoading = true;
        api
          .addlist(data)
          .then(_ => {
            console.log(_);
          })
          .catch(_ => {
            this.$message({
              type: "error",
              message: "添加失败!"
            });
            this.addOrEditLoading = false;
          });
      } else {
        if (this.list.filter(obj => obj.imei == this.imei).length) {
          this.$message({
            type: "warning",
            message: "该imei已存在!"
          });
          return;
        }
        let data = {
          key: this.imei
        };
        if (this.roles !== "admin") {
          data.type = this.type;
          data.model = this.type;
        }
        this.addOrEditLoading = true;
        api
          .addlist(data)
          .then(_ => {
            // console.log(data)
            if (_.id) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.dialogState = false;
              // this.getList()
              this.addOrEditLoading = false;
            } else {
              return Promise.reject();
            }
          })
          .catch(_ => {
            console.log("报错信息" + _);
            this.$message({
              type: "error",
              message: "添加失败!"
            });
            this.addOrEditLoading = false;
          });
      }
    },
    deleteEqu(id) {
      this.$confirm("删除后无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .deletenew(id)
            .then(_ => {
              if (_) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getList();
              }
            })
            .catch(_ => {
              this.$message({
                type: "danger",
                message: "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style type="stylesheet/scss" lang="scss" scoped>
</style>
