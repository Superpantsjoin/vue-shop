<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>

            <!-- 提示栏 -->
            <el-alert
                title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon>
            </el-alert>

            <!-- 步骤条区域 -->
            <el-steps :space="200" :active="+activeName" finish-status="success" :align-center="true">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 编辑区域 -->
            <el-form :model="addGoodObj" :rules="addGoodRules" ref="addGoodForm" label-width="100px" label-position="top">
                <el-tabs tab-position="left" v-model="activeName" :before-leave="handleLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodObj.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodObj.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodObj.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodObj.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="selectIds"
                                :options="categoriesList"
                                :props="cascaderProps"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyPropList" :key="item.attr_id" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="(name, index) in item.attr_vals" :key="index" :label="name" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyPropList" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :headers="headerObj"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addGoodObj.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="addGood">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片展示对话框 -->
        <el-dialog
            title="图片预览"
            :visible.sync="picDialog"
            width="50%">
            <img :src="picUrl" alt="图片" class="pic" />
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'addGoodPage',
    data() {
        return {
            activeName: 0,
            addGoodObj: {
                goods_name: '',
                goods_cat: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_introduce: '',
                pics: [],
                attrs: []
            },
            addGoodRules: {
                goods_name: [
                    { required: true, message: '请填写商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请填写商品价格', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请填写商品数量', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请填写商品重量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },
            categoriesList: [],
            cascaderProps: {
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            selectIds: '',
            manyPropList: [],
            onlyPropList: [],
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            picUrl: '',
            picDialog: false
        }
    },
    methods: {
        async getCategoriesList() {
            const resp = await this.$http.get('categories');
            if(resp.data.meta.status === 200) {
                this.categoriesList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        async getCategoriesManyProps() {
            const resp = await this.$http.get('categories/' + this.selectIds[2] + '/attributes/', {
                params: {
                    sel: 'many'
                }
            });
            if(resp.data.meta.status === 200) {
                resp.data.data.forEach(ele => {
                    ele.attr_vals = ele.attr_vals ? ele.attr_vals.split(' ') : [];
                });
                this.manyPropList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        async getCategoriesOnlyProps() {
            const resp = await this.$http.get('categories/' + this.selectIds[2] + '/attributes/', {
                params: {
                    sel: 'only'
                }
            });
            if(resp.data.meta.status === 200) {
                this.onlyPropList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        handleChange() {
            if(this.selectIds.length !== 3) {
                this.$message.info('当前为非第三级分类');
                this.selectIds = [];
            } else {
                this.addGoodObj.goods_cat = this.selectIds;
                this.getCategoriesManyProps();
                this.getCategoriesOnlyProps();
            }
        },
        handleLeave(go, from) {
            if(!from && from != '0') {
                return ;
            }
            if(go == '1' || go == '2') {
                if(this.selectIds.length != 3) {
                    this.$message.info('请选择商品分类');
                    return false;
                }
            }
        },
        handlePreview(file) {
            this.picUrl = file.response.data.url;
            this.picDialog = true;
        },
        handleRemove(file) {
            const picPath = file.response.data.tmp_path;
            const index = this.addGoodObj.pics.findIndex( ele => {
                return ele.pic == picPath;
            });
            this.addGoodObj.pics.splice(index, 1);
        },
        handleSuccess(resp) {
            const picPath = { pic: resp.data.tmp_path };
            this.addGoodObj.pics.push(picPath);
        },
        addGood() {
            this.$refs.addGoodForm.validate(async flag => {
                if(flag) {
                    this.addGoodObj.goods_cat = this.selectIds.join(',');
                    this.manyPropList.forEach(ele => {
                        const newInfo = {
                            attr_id: ele.attr_id,
                            attr_value: ele.attr_vals.join(',')
                        };
                        this.addGoodObj.attrs.push(newInfo);
                    });
                    this.onlyPropList.forEach(ele => {
                        const newInfo = {
                            attr_id: ele.attr_id,
                            attr_value: ele.attr_vals
                        };
                        this.addGoodObj.attrs.push(newInfo);
                    });
                    const resp = await this.$http.post('goods', this.addGoodObj);
                    if(resp.data.meta.status === 201) {
                        this.$message.success(resp.data.meta.msg);
                        this.$router.push('/home/goods');
                    } else {
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.info('请填写基本信息');
                }
            })
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
.el-steps{
    margin: 15px auto;
}
.el-checkbox{
    margin: 0 10px 0 0 !important;
}
.pic{
    width: 100%;
}
.el-button{
    margin-top: 15px;
}
</style>