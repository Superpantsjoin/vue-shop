<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialog=true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolesList" :border="true" :stripe="true">
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeInfo(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框 -->
        <add-dialog :show.sync="addDialog" @event="getRolesList"></add-dialog>

        <!-- 编辑角色对话框 -->
        <change-dialog :show.sync="changeDialog" @event="getRolesList" :datas="changeDialogObj"></change-dialog>
    </div>
</template>

<script>
import addDialog from './AddRoleDialog.vue'
import changeDialog from './ChangeRoleDialog.vue'
export default {
    name: 'roles',
    data() {
        return {
            rolesList: [],
            addDialog: false,
            changeDialog: false,
            changeDialogObj: {}
        }
    },
    methods: {
        async getRolesList() {
            const resp = await this.$http.get('roles');
            if(resp.data.meta.status === 200) {
                this.rolesList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        changeInfo(roleinfo) {
            this.changeDialog = true;
            this.changeDialogObj = roleinfo;
        },
        async deleteRoleById(id) {
            const resp = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if(resp == 'confirm') {
                const res = await this.$http.delete('roles/' + id);
                if(res.data.meta.status === 200) {
                    this.$message.success(res.data.meta.msg);
                    this.getRolesList();
                } else {
                    this.$message.error(res.data.meta.msg);
                }
            } else {
                this.$message.info('已取消删除');
            }
        }
    },
    components: {
        addDialog,
        changeDialog
    },
    created() {
        this.getRolesList();
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
.el-table {
    margin-top: 15px;
    font-size: 12px;
}
</style>