<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" :stripe="true" :border="true" style="width: 100%">
                <el-table-column type="index" label="#" align="center"></el-table-column>
                <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
                <el-table-column label="路径" prop="path" align="center"></el-table-column>
                <el-table-column label="权限等级" prop="level" align="center">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
                        <el-tag v-else-if="scope.row.level == 2" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'rights',
    data() {
        return {
            rightsList: []
        }
    },
    methods: {
        async getRightsList() {
            const resp = await this.$http.get('rights/list');
            if(resp.data.meta.status === 200) {
                this.rightsList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        }
    },
    created() {
        this.getRightsList();
    }
}
</script>

<style scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}
.el-card {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.15);
}
</style>