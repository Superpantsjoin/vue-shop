<template>
    <el-dialog
        title="分配角色"
        :visible.sync="setDialog"
        @close="closeDialog"
        width="30%">
        <div>
            <p>当前的用户 : {{ setRoleObj.username }}</p>
            <p>当前的角色 : {{ setRoleObj.role_name }}</p>
            <p>分配新角色 : 
                <el-select v-model="selectId" placeholder="请选择">
                    <el-option
                        v-for="item in setRolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setDialog = false">取 消</el-button>
            <el-button type="primary" @click="setRole">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            setDialog: this.show,
            setRoleObj: this.datas,
            setRolesList: this.setDialogList,
            selectId: ''
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
        },
        setDialogList: {
            type: Array,
            default: []
        }
    },
    methods: {
        closeDialog() {
            this.$emit('update:show', false);
            this.selectId = '';
        },
        async setRole() {
            const resp = await this.$http.put('users/' + this.setRoleObj.id + '/role', {
                rid: this.selectId
            });
            this.setDialog = false;
            if(resp.data.meta.status === 200) {
                this.$message.succeess(resp.data.meta.msg);
                this.$emit('event');
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        }
    },
    watch: {
        show() {
            this.setDialog = this.show;
        },
        datas() {
            this.setRoleObj = this.datas;
        },
        setDialogList() {
            this.setRolesList = this.setDialogList;
        }
    }
}
</script>