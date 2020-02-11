<template>
    <el-dialog
        title="添加角色" 
        :visible.sync="addDialog" 
        width="30%" 
        @close="closeDialog">
        <el-form :model="addRoleObj" :rules="addRoleRules" ref="addRoleForm" label-width="70px">
            <el-form-item label="名称"  prop="roleName">
                <el-input v-model="addRoleObj.roleName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="roleDesc">
                <el-input v-model="addRoleObj.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialog=false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            addDialog: this.show,
            addRoleObj: {
                roleName: '',
                roleDesc: ''
            },
            addRoleRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 1, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 1, message: '请输入角色描述', trigger: 'blur' }
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
        async addRole() {
            this.$refs.addRoleForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.post('roles', this.addRoleObj);
                    if(resp.data.meta.status === 201) {
                        // this.getRolesList();
                        this.$emit('event');
                        this.addDialog = false;
                        this.$message.success(resp.data.meta.msg);
                    } else {
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.error('请按照格式填写数据');
                }
            })
        },
        closeDialog() {
            this.$emit('update:show', false);
        }
    },
    watch: {
        show() {
            this.addDialog = this.show;
        }
    }
};
</script>