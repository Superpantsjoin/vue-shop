<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addInfo()">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表区域 -->
            <tree-table 
                class="tree-table"
                :data="categoriesList" 
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                :show-index="true"
                index-text="#"
                :border="true"
                :show-row-hover="false">

                <template v-slot:ok="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>

                <template v-slot:order="scope">
                    <el-tag type="primary" size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level == 2">三级</el-tag>
                </template>

                <template v-slot:operation="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="changeInfo(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategoryById(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryObj.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryObj.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <add-dialog :show.sync="addDialog" @event="getCategoriesList" :parents="addDialogParentsList"></add-dialog>

        <!-- 编辑分类对话框 -->
        <change-dialog :show.sync="changeDialog" @event="getCategoriesList" :datas="changeDialogObj"></change-dialog>
    </div>
</template>

<script>
import addDialog from './AddCategoryDialog.vue'
import changeDialog from './ChangeCategoryDialog'
export default {
    name: 'categories',
    data() {
        return {
            queryObj: {
                type: 3,
                pagenum: 1,
                pagesize: 2
            },
            categoriesList: [],
            total: 0,
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'ok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'operation'
                }
            ],
            addDialog: false,
            addDialogParentsList: [],
            changeDialog: false,
            changeDialogObj: {}
        }
    },
    components: {
        addDialog,
        changeDialog
    },
    methods: {
        async getCategoriesList() {
            const resp = await this.$http.get('categories', {
                params: this.queryObj
            });
            if(resp.data.meta.status === 200) {
                this.categoriesList = resp.data.data.result;
                this.total = resp.data.data.total;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        handleSizeChange(newSize) {
            this.queryObj.pagesize = newSize;
            this.getCategoriesList();
        },
        handleCurrentChange(newPage) {
            this.queryObj.pagenum = newPage;
            this.getCategoriesList();
        },
        async addInfo() {
            this.addDialog = true;
            const resp = await this.$http.get('categories', {
                params: {type: 2}
            });
            if(resp.data.meta.status === 200) {
                this.addDialogParentsList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        changeInfo(changeinfo) {
            this.changeDialog = true;
            this.changeDialogObj = changeinfo;
        },
        async deleteCategoryById(id) {
            const resp = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if(resp == 'confirm') {
                const res = await this.$http.delete('categories/' + id);
                if(res.data.meta.status === 200) {
                    this.getCategoriesList();
                    this.$message.success(res.data.meta.msg);
                } else {
                    this.$message.error(res.data.meta.msg);
                }
            } else {
                this.$message.info('已取消删除');
            }
        }
    },
    created() {
        this.getCategoriesList();
    }
}
</script>

<style scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}
.el-card {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.15);
}
.tree-table {
    margin-top: 15px;
    font-size: 12px;
}
.el-pagination {
    margin-top: 15px;
}
</style>