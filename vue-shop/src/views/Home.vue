<template>
    <el-container class="home_container">
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="logo" class="logo">
                <span class="title">电商后台管理系统</span>
            </div>
            <el-button type="info" @click="exit">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">Aside1</el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
    
</template>

<script>
export default {
    methods: {
        exit() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
    .home_container{
        height: 100%;
    }
    .el-header{
        min-width: 320px;
        background: linear-gradient(to right, #333, #111, #aaa);
        position: relative;
        padding-left: 0;
    }
    .el-header::after{
        content:'';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: url('../assets/bg.png') repeat center center;
    }
    .logo{
        width: 45px;
        height: 45px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    .title{
        color: #fff;
        font-size: 20px;
        display: block;
        height: 60px;
        line-height: 60px;
        margin-left: 50px;
    }
    .el-button{
        height: 70%;
        position: absolute;
        z-index: 1;
        top: 0;
        bottom: 0;
        right: 1%;
        margin: auto;
    }
    .el-aside{
        background-color: #333744;
    }
    .el-main{
        background-color: #eaedf1;
    }
</style>