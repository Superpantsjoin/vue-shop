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
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryObj.query"
                        @clear="getUserList"
                        clearable
                    >
                        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialog=true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 展示区域 -->
            <el-table :data="userList" border :stripe="true">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="userStateChanged(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="changeInfo(scope.row)"
                        ></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setInfo(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryObj.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryObj.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <add-dialog :show.sync="addDialog" @event="getUserList"></add-dialog>

        <!-- 修改用户信息对话框 -->
        <change-dialog :show.sync="changeDialog" @event="getUserList" :datas="changeDialogObj"></change-dialog>

        <!-- 分配角色对话框 -->
        <set-dialog 
            :show.sync="setDialog" 
            @event="getUserList" 
            :datas="setDialogObj" 
            :setDialogList="setDialogList"
        ></set-dialog>
    </div>
</template>

<script>
import addDialog from './AddUserDialog.vue';
import changeDialog from './ChangeUserDialog.vue';
import setDialog from './SetRoleDialog.vue'

export default {
    name: 'users',
    data() {
        return {
            queryObj: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            userList: [],
            addDialog: false,
            changeDialog: false,
            changeDialogObj: {},
            setDialog: false,
            setDialogObj: {},
            setDialogList: []
        };
    },
    methods: {
        async getUserList() {
            const resp = await this.$http.get('users', {
                params: this.queryObj
            });
            if (resp.data.meta.status === 200) {
                this.total = resp.data.data.total;
                this.userList = resp.data.data.users;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        handleSizeChange(newSize) {
            this.queryObj.pagesize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage) {
            this.queryObj.pagenum = newPage;
            this.getUserList();
        },
        async userStateChanged(userinfo) {
            // console.log(userinfo.mg_state);
            const resp = await this.$http.put("users/" + userinfo.id + "/state/" + userinfo.mg_state);
            if (resp.data.meta.status === 200) {
                this.$message.success(resp.data.meta.msg);
            } else {
                userinfo.mg_state = !userinfo.mg_state;
                this.$message.error(resp.data.meta.msg);
            }
        },
        searchUser() {
            this.queryObj.pagenum = 1;
            this.getUserList();
        },
        changeInfo(userinfo) {
            this.changeDialog = true;
            this.changeDialogObj = userinfo;
        },
        async deleteUserById(id) {
            const resp = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((err) => err);
            if(resp == 'confirm') {
                const res = await this.$http.delete('users/' + id);        
                if(res.data.meta.status === 200) {
                    this.searchUser();
                    this.$message.success(res.data.meta.msg);
                } else {
                    this.$message.error(res.data.meta.msg);
                }
            } else {
                this.$message.info('已取消删除');
            }
        },
        async setInfo(userinfo) {
            this.setDialog = true;
            this.setDialogObj = userinfo;
            const resp = await this.$http.get('roles');
            if(resp.data.meta.status === 200) {
                this.setDialogList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        }
    },
    components: {
        addDialog,
        changeDialog,
        setDialog
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
.el-table {
    margin-top: 15px;
    font-size: 12px;
}
.el-pagination {
    margin-top: 15px;
}
</style>

