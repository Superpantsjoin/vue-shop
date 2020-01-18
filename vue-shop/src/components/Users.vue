<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 展示区域 -->
            <el-table :data="userList" border :stripe="true">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="id" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'users',
    data() {
        return {
            queryObj: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            total: 0,
            userList: []
        };
    },
    methods: {
        async getUserList() {
            const resp = await this.$http.get('users', {
                params: this.queryObj
            });
            if (resp.data.meta.status !== 200) {
                return this.$message.error('获取用户信息失败!');
            } else {
                this.total = resp.data.data.total;
                this.userList = resp.data.data.users;
            }
        }
    },
    created() {
        this.getUserList();
    }
};
</script>

<style scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }
    .el-card {
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.15);
    }
    .el-table{
        margin-top: 15px;
        font-size: 12px;
    }
</style>