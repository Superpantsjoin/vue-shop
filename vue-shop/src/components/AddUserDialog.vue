<template>
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
            <el-button @click="addDialog=false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import util from '../util/checkData.js'

export default {
    data() {
        return {
            addDialog: this.show,
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
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        closeDialog() {
            this.$refs.addUserForm.resetFields();
            this.$emit('update:show', false);
        },
        addUser() {
            this.$refs.addUserForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.post('users', this.addUserObj);
                    this.addDialog = false;
                    if(resp.data.meta.status === 201){
                        // this.getUserList(); 通过$emit触发获取列表
                        this.$emit('event');
                        this.$message.success(resp.data.meta.msg);
                    } else {
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.error('请按照格式填写数据');
                }
            });
        },
        checkEmail: util.checkEmail,
        checkPhone: util.checkPhone
    },
    watch: {
        show() {
            this.addDialog = this.show;
        }
    }
}
</script>