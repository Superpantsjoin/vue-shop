<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryObj.query"
                        @clear="getOrdersList"
                        clearable>
                        <el-button slot="append" icon="el-icon-search" @click="searchOrders"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 展示区域 -->
            <el-table :data="orderList" :border="true" :stripe="true">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="order_pay">
                    <template v-slot="scope">
                        <el-tag size="mini" type="success" v-if="!scope.row.order_pay">已付款</el-tag>
                        <el-tag size="mini" type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template v-slot="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="changeDialog=true"
                        ></el-button><el-button
                            type="success"
                            icon="el-icon-location"
                            size="mini"
                            @click="showInfo(scope.row)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryObj.pagenum"
                :page-sizes="[2, 5, 10]"
                :page-size="queryObj.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="changeDialog"
            @close="changeDialogClose"
            width="30%">
            <el-form :model="changeDialogObj" :rules="changeDialogRules" ref="changeForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="省市区/县" prop="addr1">
                    <el-cascader
                        v-model="changeDialog.attr1"
                        :options="cityData"
                        :props="cascaderProps"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="addr2">
                    <el-input v-model="changeDialogObj.addr2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeOrder">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流信息对话框 -->
        <el-dialog
            title="物流信息"
            :visible.sync="showDialog"
            @close="showDialog=false"
            width="50%">
            <el-timeline>
                <el-timeline-item
                v-for="(item, index) in wuliuInfo"
                :key="index"
                :timestamp="item.time"
                color="skyblue">
                {{item.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from '../assets/js/citydata.js'
export default {
    name: 'orders',
    data() {
        return {
            queryObj: {
                query: '',
                pagesize: 5,
                pagenum: 1
            },
            total: 0,
            orderList: [],
            changeDialog: false,
            changeDialogObj:{
                addr1: [],
                addr2: ''
            },
            changeDialogRules: {
                addr1: [
                    { required: true, message: '请选择省市区县', trigger: 'blur' }
                ],
                addr2: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ],
            },
            cascaderProps: {
                expandTrigger: 'hover',
                label: 'label',
                value: 'value',
                children: 'children'
            },
            cityData,
            showDialog: false,
            wuliuInfo: []
        }
    },
    methods: {
        async getOrdersList() {
            const resp = await this.$http.get('orders', {
                params: this.queryObj
            });
            if(resp.data.meta.status === 200) {
                this.total = resp.data.data.total;
                this.orderList = resp.data.data.goods;
            } else {
                this.$message(resp.data.meta.msg);
            }
        },
        handleSizeChange(newSize) {
            this.queryObj.pagesize = newSize;
            this.getOrdersList();
        },
        handleCurrentChange(newPage) {
            this.queryObj.pagenum = newPage;
            this.getOrdersList();
        },
        searchOrders() {
            this.$message.info('123');
            this.queryObj.pagenum = 1; 
            this.getOrdersList();
        },
        changeOrder() {
            this.changeDialog = false;
            this.$message.success('修改成功');
            this.$refs.changeForm.resetFields();
        },
        changeDialogClose() {
            this.changeDialog = false;
            this.$refs.changeForm.resetFields();
        },
        async showInfo(showinfo) {
            const resp = await this.$http.get('/kuaidi/1106975712662');
            this.showDialog = true;
            if(resp.data.meta.status === 200) {
                this.wuliuInfo = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        }
    },
    created() {
        this.getOrdersList();
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
.el-pagination {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>