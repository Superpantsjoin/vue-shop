<template>
    <div class="login_container"> 
        <div class="login_box">
            <div class="logo_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm: { // 登录表单数据
                username: "admin",
                password: "123456"
            },
            loginFormRules: { // 表单验证规则
                username: [
                    { required: true, message: "请输入账号", trigger: "blur" },
                    { min: 5, max: 16, message: "长度在 5 到 16 个字符", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
                ]
            }
        }
    },
    methods: {
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            // validate 表单验证方法
            this.$refs.loginFormRef.validate(async flag => {
                if(!flag) return;
                const resp = await this.$http.post("login", this.loginForm);
                if(resp.data.meta.status != 200){
                    this.$refs.loginFormRef.resetFields();
                    return this.$message.error("账号或密码错误");
                }else{
                    this.$message.success("登录成功");
                    // 令牌保存
                    window.sessionStorage.setItem("token", resp.data.data.token);
                    // 页面跳转
                    this.$router.push('/home');
                }
            });
        }
    }
};
</script>

<style scoped>
    .login_container{
        background-color: rgb(67, 150, 153);
        height: 100%;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    .logo_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(242, 253, 223);
        box-shadow: 0 0 10px rgb(173, 230, 245);
        -moz-user-select: none; 
        -o-user-select:none; 
        -khtml-user-select:none; 
        -webkit-user-select:none; 
        -ms-user-select:none; 
        user-select:none;
    }

    .logo_box img{
        width: 70%;
        height: 70%;
        margin-top: 30px;
        margin-left: 15%;
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns{
        display: flex;
        justify-content: flex-end;
    }
</style>