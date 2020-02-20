<template>
    <el-dialog
        title="提示"
        :visible.sync="changeDialog"
        width="30%"
        @close="closeDialog">
        <el-form :model="changeObj" :rules="changeCategoryRules" ref="changeCategoryForm" label-width="100px">
            <el-form-item label="分类名称: "  prop="cat_name">
                <el-input v-model="changeObj.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="changeDialog = false">取 消</el-button>
            <el-button type="primary" @click="changeCategory">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            changeDialog: this.show,
            changeObj: this.datas,
            changeCategoryRules: {
                cat_name: [
                    { required: true, message: "请输入分类名称", trigger: "blur" }
                ]
            },
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        datas: {
            type: Object,
            default: ''
        }
    },
    methods: {
        closeDialog() {
            this.$refs.changeCategoryForm.resetFields();
            this.$emit('update:show', false);
        },
        changeCategory() {
            this.$refs.changeCategoryForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.put('categories/' + this.changeObj.cat_id, {
                        cat_name: this.changeObj.cat_name
                    });
                    this.changeDialog = false;
                    if(resp.data.meta.status === 200) {
                        this.$message.success(resp.data.meta.msg);
                        this.$emit('event');
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
            this.changeObj = this.datas;
        }
    }
}
</script>