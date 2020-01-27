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
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
        <el-dialog
            title="添加用户"
            :visible.sync="addDialog"
            @close="closeDialog"
            width="30%">
            <el-form :model="addUserObj" :rules="addUserRules" ref="addUserForm" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserObj.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserObj.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserObj.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="addUserObj.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
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
                pagesize: 5
            },
            total: 0,
            userList: [],
            addDialog: false,
            addUserObj: {
                username: '',
                password: '',
                email: '',
                phone: ''
            },
            addUserRules: {
                username: [
                    { required: true, message: "请输入账号", trigger: "blur" },
                    { min: 5, max: 16, message: "长度在 5 到 16 个字符", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
                ],
                email: [
                    { required: false, validator: this.checkEmail, trigger: "blur" },
                ],
                phone: [
                    { required: false, validator: this.checkPhone, trigger: "blur" },
                ]
            }
        };
    },
    methods: {
        async getUserList() {
            const resp = await this.$http.get('users', {
                params: this.queryObj
            });
            if (resp.data.meta.status !== 200) {
                return this.$message.error(resp.data.meta.msg);
            } else {
                this.total = resp.data.data.total;
                this.userList = resp.data.data.users;
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
            const resp = await this.$http.put(
                `users/${userinfo.id}/state/${userinfo.mg_state}`
            );
            if (resp.data.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state;
                return this.$message.error(resp.data.meta.msg);
            }
            this.$message.success(resp.data.meta.msg);
        },
        searchUser() {
            this.queryObj.pagenum = 1;
            this.getUserList();
        },
        closeDialog() {
            this.$refs.addUserForm.resetFields();
        },
        addUser() {
            this.$refs.addUserForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.post('users', this.addUserObj);
                    if(resp.data.meta.status === 201){
                        this.getUserList();
                        this.addDialog = false;
                        this.$message.success(resp.data.meta.msg);
                    } else {
                        this.$refs.addUserForm.resetFields();
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.error('请按照格式填写数据');
                }
            });
        },
        checkEmail(rule, value, callback) {
            const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if(reg.test(value)) {
                callback();
            }else if(value != '') {
                callback(new Error('请输入正确的邮箱格式!'));
            }
            callback();
        },
        checkPhone(rule, value, callback) {
            const reg = /^(0|86|17951)?(13[0-9]|14[056789]|15[012356789]|16[6]|17[345678]|18[0-9]|19[89])[0-9]{8}$/;
            if(reg.test(value)) {
                callback();
            }else if(value != '') {
                callback(new Error('请输入正确的手机号!'));
            }
            callback();
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
    .el-table {
        margin-top: 15px;
        font-size: 12px;
    }
    .el-pagination {
        margin-top: 15px;
    }
</style>