<template>
    <el-container>
        <el-header>
            <el-button type="info" @click="exit">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
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