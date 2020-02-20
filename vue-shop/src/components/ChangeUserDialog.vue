<template>
    <el-dialog
        title="修改信息"
        :visible.sync="changeDialog"
        @close="closeDialog"
        width="30%">
        <el-form :model="changeUserObj" :rules="changeUserRules" ref="changeUserForm" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="changeUserObj.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="changeUserObj.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="changeUserObj.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="changeDialog=false">取 消</el-button>
            <el-button type="primary" @click="changeUser">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import util from '../util/checkData.js'

export default {
    data() {
        return {
            changeDialog: this.show,
            changeUserObj: {
                username: '',
                email: '',
                mobile: ''
            },
            changeUserRules: {
                email: [
                    { required: false, validator: this.checkEmail, trigger: "blur" },
                ],
                mobile: [
                    { required: false, validator: this.checkPhone, trigger: "blur" },
                ]
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        datas: {
            type: Object,
            default: {}
        }
    },
    methods: {
        closeDialog() {   
            this.$emit("update:show", false);
            // this.$refs.changeUserForm.resetFields();
            this.$emit('event');  // 耗费性能
        },
        changeUser() {
            this.$refs.changeUserForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.put('users/' + this.datas.id, {
                        email: this.changeUserObj.email,
                        mobile: this.changeUserObj.mobile
                    });
                    this.changeDialog = false;
                    if(resp.data.meta.status === 200) {
                        this.$emit('event');
                        this.$message.success(resp.data.meta.msg);
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
            this.changeDialog = this.show;
        },
        datas() {
            this.changeUserObj = this.datas;
        }
    }
}
</script>