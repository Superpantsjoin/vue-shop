<template>
    <el-dialog
        title="设置权限"
        :visible.sync="setDialog"
        @close="closeDialog"
        width="40%">
        <el-tree 
            :data="setRightsList" 
            :props="setRightsProps"
            :show-checkbox="true"
            node-key="id"
            :default-expand-all="true"
            :default-checked-keys="setId"
            ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setDialog = false">取 消</el-button>
            <el-button type="primary" @click="setRight">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            setDialog: this.show,
            setRightsList: this.setDialogList,
            setRightsProps: {
                children: 'children',
                label: 'authName'
            },
            setId: this.setRightsId,
            setRightObj: this.datas
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        setDialogList: {
            type: Array,
            default: []
        },
        setRightsId: {
            type: Array,
            default: []
        },
        datas: {
            type: Object,
            default: {}
        }
    },
    methods: {
        closeDialog() {
            this.$emit('update:show', false);
        },
        async setRight() {
            var arr = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
            var strId = arr.join(',');
            const resp = await this.$http.post('roles/' + this.setRightObj.id + '/rights', {
                rids: strId
            });
            this.setDialog = false;
            if(resp.data.meta.status === 200) {
                this.$message.success(resp.data.meta.msg);
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
        setDialogList() {
            this.setRightsList = this.setDialogList;
        },
        setRightsId() {
            this.setId = this.setRightsId;
        },
        datas() {
            this.setRightObj = this.datas;
        }
    }
}
</script>