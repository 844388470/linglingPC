<template>
    <div id="PersonalCenter">
        <el-card shadow="always" :style="'height:'+height+'px'">
            <el-col  :xs="16" :sm="12" :md="9" :lg="7" :xl="5">
                <div class="content_title">
                    <el-form ref="form" :model="form" label-width="120px" label-position="top">
                        
                            <label class="el-form-item__label">登录账号:</label>
                            <el-input v-model="form.userName" disabled></el-input>
                        
                            <label class="el-form-item__label">上次登录时间:</label>
                            <el-input v-model="form.date" disabled></el-input>
                       
                            <label class="el-form-item__label">姓名: <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="changeName"></el-button></label>
                            <el-input ref="name" v-model="form.name" :disabled="disabName" @blur="blurName" ></el-input>
                        
                            <label class="el-form-item__label">年龄: <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="changeAge"></el-button></label>
                            <el-input ref="age" v-model="form.age" :disabled="disabAge" @blur="blurAge" ></el-input>
                        
                            <label class="el-form-item__label">角色:</label>
                            <el-input v-model="form.roles" disabled></el-input>
                        
                    </el-form>
                </div>
            </el-col>
        </el-card>
    </div>
</template>
<script>
    export default{
        name:'PersonalCenter',
        data(){
            return {
                height:0,
                disabName:true,
                disabAge:true,
                name:'',
                age:'',
                form: {
                    userName:'Anne@163.com',
                    date:'2017-09-25 15:00:00',
                    name: '马大牛',
                    age: '26',
                    roles: '管天管地',
                }
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-130
            this.name=this.form.name
            this.age=this.form.age
        },
        methods:{
            changeName(){
                this.disabName=false
                setTimeout(_=>{
                    this.$refs.name.focus()
                },100)
            },
            changeAge(){
                this.disabAge=false
                setTimeout(_=>{
                    this.$refs.age.focus()
                },100)
            },
            blurName(){
                this.disabName=true
                if(this.name!==this.form.name){
                    this.name=this.form.name
                }
            },
            blurAge(){
                this.disabAge=true
                if(this.age!==this.form.age){
                    this.age=this.form.age
                }
            },
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    #PersonalCenter{
        .el-input__inner{
            background-color: #fff !important;
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    #PersonalCenter{
        .el-input.is-disabled .el-input__inner{
            background-color: #fff !important;
            color: #606266;
            border:0;
            
        }
    }
</style>