<template>
    <el-button type="info" @click="exit">退出</el-button>
</template>

<script>
export default {
    methods: {
        exit(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        }
    }
}
</script>