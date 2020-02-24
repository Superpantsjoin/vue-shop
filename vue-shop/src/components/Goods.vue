<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryObj.query"
                        @clear="getGoodsList"
                        clearable
                    >
                        <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGood">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 展示区域 -->
            <el-table :data="goodsList" :border="true" :stripe="true">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template v-slot="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template v-slot="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="changeInfo(scope.row)"
                        ></el-button>
                        <el-button 
                            type="danger" 
                            icon="el-icon-delete" 
                            size="mini" 
                            @click="deleteGoodById(scope.row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryObj.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryObj.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 编辑商品对话框 -->
        <change-dialog :show.sync="changeDialog" @event="getGoodsList" :datas="changeObj"></change-dialog>
    </div>
</template>

<script>
import changeDialog from './ChangeGoodDialog.vue'
export default {
    name: 'goods',
    data() {
        return {
            queryObj: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            goodsList: [],
            changeDialog: false,
            changeObj: {}
        }
    },
    methods: {
        async getGoodsList() {
            const resp = await this.$http.get('goods', {
                params: this.queryObj
            });
            if(resp.data.meta.status === 200) {
                this.total = resp.data.data.total;
                this.goodsList = resp.data.data.goods;
            } else {
                this.$message(resp.data.meta.msg);
            }
        },
        handleSizeChange(newSize) {
            this.queryObj.pagesize = newSize;
            this.getGoodsList();
        },
        handleCurrentChange(newPage) {
            this.queryObj.pagenum = newPage;
            this.getGoodsList();
        },
        searchGoods() {
            this.queryObj.pagenum = 1;
            this.getGoodsList();
        },
        async deleteGoodById(id) {
            const resp = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if(resp == 'confirm') {
                const res = await this.$http.delete('goods/' + id);
                if(res.data.meta.status === 200) {
                    this.$message.success(res.data.meta.msg);
                    this.getGoodsList();
                } else {
                    this.$message.error(res.data.meta.msg);
                }
            } else {
                this.$message.info('已取消删除');
            }
        },
        addGood() {
            this.$router.push('goods/addGoodPage');
        },
        changeInfo(goodinfo) {
            this.changeDialog = true;
            this.changeObj = goodinfo;
        }
    },
    components: {
        changeDialog
    },
    created() {
        this.getGoodsList();
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
.el-table {
    margin-top: 15px;
    font-size: 12px;
}
</style>