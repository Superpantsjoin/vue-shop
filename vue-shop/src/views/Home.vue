<template>
    <el-container class="home_container">
        <el-header>
            <top></top>
            <el-button type="info" @click="exit">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="widthShow">
                <left @getWidth="getValue"></left>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import top from '../components/Top.vue'
import left from '../components/Left.vue'
// import welcome from '../components/Welcome.vue'

export default {
    data(){
        return {
            widthShow: '200px'
        }
    },
    components: {
        top,
        left
    },
    methods: {
        exit() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        getValue(value){
            this.widthShow = value;
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
        background-color: #2b2c2e;
    }
    .el-main{
        background-color: #eaedf1;
    }
</style>