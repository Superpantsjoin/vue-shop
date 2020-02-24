<template>
    <div>
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-menu
            class="el-menu-vertical-demo"
            background-color="#2b2c2e"
            text-color="#fff"
            :unique-opened="true"
            :router="true"
            :collapse="isDisplay"
            :collapse-transition="false"
            active-text-color="#409eff"
        >
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                    <i :class="iconObj[item.order]"></i>
                    <span>{{ item.authName }}</span>
                </template>
                <el-menu-item :index="'/home/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{ subItem.authName }}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'left',
    data(){
        return {
            menuList: [],
            // 一级菜单icon
            iconObj: {
                '1': 'iconfont icon-user',
                '2': 'iconfont icon-tijikongjian',
                '3': 'iconfont icon-shangpin',
                '4': 'iconfont icon-danju',
                '5': 'iconfont icon-baobiao'
            },
            isDisplay: false
        }
    },
    created(){
        this.getMenuList();
    },
    methods: {
        // 获取菜单列表
        async getMenuList(){
            const resp =  await this.$http.get('/menus');
            if(resp.data.meta.status !== 200) return this.$message.error(resp.data.meta.msg);
            this.menuList = resp.data.data;
        },
        // 切换菜单状态
        toggleMenu(){
            if(this.isDisplay){
                this.$emit('getWidth', '200px');  
            }else{
                this.$emit('getWidth', '64px');
            }
            this.isDisplay = !this.isDisplay;
        }
    }
}
</script>

<style scoped>
    .el-menu{
        border-right: 0;
    }
    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
        font-size: 10px;
        color: #fff;
        background-color: rgb(56, 56, 56);
        text-align: center;
        line-height: 24px;
        letter-spacing: .2em;
        cursor: pointer;
    }
    .toggle-button:hover{
        background-color: rgb(85, 87, 87);
    }
</style>