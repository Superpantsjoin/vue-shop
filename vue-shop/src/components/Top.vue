<template>
    <div>
        <img src="../assets/logo.png" alt="logo" class="logo">
        <span class="title">电商后台管理系统</span>
    </div>
</template>

<script>
export default {
    name: 'top',
};
</script>

<style scoped>
    .logo{
        width: 35px;
        height: 35px;
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
</style>