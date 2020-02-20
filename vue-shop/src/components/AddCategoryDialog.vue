<template>
    <el-dialog
        title="添加分类" 
        :visible.sync="addDialog" 
        width="40%" 
        @close="closeDialog">
        <el-form :model="addCategoryObj" :rules="addCategoryRules" ref="addCategoryForm" label-width="100px">
            <el-form-item label="分类名称: " prop="cat_name">
                <el-input v-model="addCategoryObj.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类: ">
                <el-cascader
                    v-model="selectIds"
                    :options="parentsList"
                    :props="cascaderProps"
                    :clearable="true"
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialog=false">取 消</el-button>
            <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            addDialog: this.show,
            addCategoryObj: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            addCategoryRules: {
                cat_name: [
                    { required: true, message: "请输入分类名称", trigger: "blur" }
                ],
            },
            parentsList: this.parents,
            cascaderProps: {
                expandTrigger: 'hover',
                checkStrictly: true,
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            selectIds: []
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        parents: {
            type: Array,
            default: []
        }
    },
    methods: {
        closeDialog() {
            this.selectIds = [];
            this.handleChange();
            this.$refs.addCategoryForm.resetFields();
            this.$emit('update:show', false);
        },
        addCategory() {
            this.$refs.addCategoryForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.post('categories', this.addCategoryObj);
                    this.addDialog = false;
                    if(resp.data.meta.status === 201) {
                        this.$emit('event');
                        this.$message.success(resp.data.meta.msg);
                    } else {
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.error('请按格式填写数据');
                }
            })
        },
        handleChange() {
            var len = this.selectIds.length;
            if(len > 0) {
                this.addCategoryObj.cat_pid = this.selectIds[len - 1];
            } else {
                this.addCategoryObj.cat_pid = 0;
            }
            this.addCategoryObj.cat_level = len;
        }
    },
    watch: {
        show() {
            this.addDialog = this.show;
        },
        parents() {
            this.parentsList = this.parents;
        }
    }
};
</script>

<style scoped>
.el-cascader {
    width: 100%;
}
</style>