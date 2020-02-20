<template>
    <el-dialog
        title="修改角色"
        :visible.sync="changeDialog"
        @close="closeDialog"
        width="30%">
        <el-form :model="changeRoleObj" :rules="changeRoleRules" ref="changeRoleForm" label-width="70px">
            <el-form-item label="名称"  prop="roleName">
                <el-input v-model="changeRoleObj.roleName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="roleDesc">
                <el-input v-model="changeRoleObj.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="changeDialog=false">取 消</el-button>
            <el-button type="primary" @click="changeRole">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import util from '../util/checkData.js'

export default {
    data() {
        return {
            changeDialog: this.show,
            changeRoleObj: {
                roleName: '',
                roleDesc: ''
            },
            changeRoleRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
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
            this.$emit('update:show', false);
            // this.$refs.changeRoleForm.resetFields();
            this.$emit('event');
        },
        changeRole() {
            this.$refs.changeRoleForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.put('roles/' + this.changeRoleObj.id, {
                        roleName: this.changeRoleObj.roleName,
                        roleDesc: this.changeRoleObj.roleDesc
                    });
                    this.changeDialog = false;
                    if(resp.data.meta.status === 200) {
                        this.$emit('event');
                        this.$message.success(resp.data.meta.msg);
                    } else {
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.error('请按照格式填写数据');
                }
            })
        }
    },
    watch: {
        show() {
            this.changeDialog = this.show;
        },
        datas() {
            this.changeRoleObj = this.datas;
        }
    }
}
</script>