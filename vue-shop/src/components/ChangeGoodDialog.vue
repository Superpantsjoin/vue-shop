<template>
    <el-dialog
        title="编辑商品"
        :visible.sync="changeDialog"
        width="30%"
        @close="closeDialog">
        <el-form :model="changeObj" :rules="changeGoodRules" ref="changeGoodForm" label-width="100px">
            <el-form-item label="商品数量: "  prop="goods_number">
                <el-input v-model="changeObj.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品价格: "  prop="goods_price">
                <el-input v-model="changeObj.goods_price"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="changeDialog = false">取 消</el-button>
            <el-button type="primary" @click="changeGood">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            changeDialog: this.show,
            changeObj: this.datas,
            changeGoodRules: {
                goods_number: [
                    { required: true, message: "请输入商品数量", trigger: "blur" }
                ],
                goods_price: [
                    { required: true, message: "请输入商品价格", trigger: "blur" }
                ]
            },
            goodObj: {}
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
            this.$refs.changeGoodForm.resetFields();
            this.$emit('update:show', false);
        },
        async changeGood() {
            const resp = await this.$http.get('goods/' + this.changeObj.goods_id);
            if(resp.data.meta.status === 200) {
                this.goodObj = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
            const res = await this.$http.put('goods/' + this.changeObj.goods_id, this.goodObj);
            this.changeDialog = false;
            if(res.data.meta.status === 200) {
                this.$emit('event');
                this.$message.success(res.data.meta.msg);
            } else {
                this.$message.error(res.data.meta.msg);
            }
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