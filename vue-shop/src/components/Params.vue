<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>

            <!-- 警告栏 -->
            <el-alert 
                title="注意: 只允许为第三级分类设置相关参数!" 
                :show-icon="true" 
                :closable="false"
                type="warning"
            ></el-alert>

            <!-- 选择商品级联框 -->
            <el-row class="select">
                <el-col>
                    <span>选择商品分类: </span>
                    <el-cascader
                        v-model="selectIds"
                        :options="categoriesList"
                        :props="cascaderProps"
                        @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>

            <!-- 动态导航 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">

                <!-- 动态 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="btnShow" @click="addDialog=true">添加参数</el-button>

                    <el-table :data="manyPropList" :border="true" :stripe="true">
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag 
                                    v-for="(item, index) in scope.row.attr_vals" 
                                    :key="index" type="primary"
                                    :closable="true"
                                    @close="removeAttrbute(scope.row, index)"
                                >{{ item }}</el-tag>
                                <el-input
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    class="input-style"
                                    @keyup.enter.native="showButton(scope.row)"
                                    @blur="showButton(scope.row)"
                                ></el-input>
                                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="changeInfo(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParamById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 静态 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="btnShow"  @click="addDialog=true">添加属性</el-button>

                    <el-table :data="onlyPropList" :border="true" :stripe="true">
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag 
                                    v-for="(item, index) in scope.row.attr_vals" 
                                    :key="index" type="primary"
                                    :closable="true"
                                    @close="removeAttrbute(scope.row, index)"
                                >{{ item }}</el-tag>
                                <el-input
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    class="input-style"
                                    @keyup.enter.native="showButton(scope.row)"
                                    @blur="showButton(scope.row)"
                                ></el-input>
                                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="changeInfo(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParamById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 添加参数对话框 -->
            <el-dialog
                :title="'添加' + dialogTitle"
                :visible.sync="addDialog"
                @close="closeAddDialog"
                width="30%">
                <el-form :model="addDialogObj" :rules="addDialogRules" ref="addForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="dialogTitle" prop="attr_name">
                        <el-input v-model="addDialogObj.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialog = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 修改参数对话框 -->
            <el-dialog
                :title="'修改' + dialogTitle"
                :visible.sync="changeDialog"
                @close="closeChangeDialog"
                width="30%">
                <el-form :model="changeDialogObj" :rules="changeDialogRules" ref="changeForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="dialogTitle" prop="attr_name">
                        <el-input v-model="changeDialogObj.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changeDialog = false">取 消</el-button>
                    <el-button type="primary" @click="changeParams">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'params',
    data() {
        return {
            categoriesList: [],
            selectIds: [],
            cascaderProps: {
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            activeName: 'many',
            manyPropList: [],
            onlyPropList: [],
            addDialog: false,
            addDialogObj: {},
            addDialogRules: {
                attr_name: [
                    { required: true, message: '请输入参数', trigger: 'blur' }
                ]
            },
            changeDialog: false,
            changeDialogObj: {},
            changeDialogRules: {
                attr_name: [
                    { required: true, message: '请输入参数', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async getCategoryList() {
            const resp = await this.$http.get('categories');
            if(resp.data.meta.status === 200) {
                this.categoriesList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        async getProps() {
            const resp = await this.$http.get('categories/' + this.selectIds[2] + '/attributes', {
                params: {
                    sel: this.activeName
                }
            });
            if(resp.data.meta.status === 200) {
                resp.data.data.forEach(ele => {
                    ele.attr_vals = ele.attr_vals ? ele.attr_vals.split(' ') : [];
                    ele.inputVisible = false;
                    ele.inputValue = '';
                });
                if(this.activeName == 'many') {
                    this.manyPropList = resp.data.data;
                } else {
                    this.onlyPropList = resp.data.data;
                }
            } else {
                this.$message.info('请先选择分类');
            }
        },
        handleChange() {
            if(this.selectIds.length === 3) {
                this.getProps();
            } else {
                this.$message.info('当前为非第三级分类');
                this.manyPropList = [];
                this.onlyPropList = [];
            }
            
        },
        handleClick() {
            this.getProps();
        },
        closeAddDialog() {
            this.$refs.addForm.resetFields();
        },
        addParams() {
            console.log(this.selectIds);
            this.$refs.addForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.post('categories/' + this.selectIds[2] + '/attributes', {
                        attr_name: this.addDialogObj.attr_name,
                        attr_sel: this.activeName
                    });
                    this.addDialog = false;
                    if(resp.data.meta.status === 201) {
                        this.$message.success(resp.data.meta.msg);
                        this.getProps();
                    } else {
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.error('请按照要求填写数据');
                }
            })
        },
        changeInfo(paraminfo){
            this.changeDialog = true;
            this.changeDialogObj = paraminfo;
        },
        closeChangeDialog() {
            this.$refs.changeForm.resetFields();
            this.getProps();
        },
        changeParams() {
            this.$refs.changeForm.validate(async flag => {
                if(flag) {
                    const resp = await this.$http.put('categories/' + this.selectIds[2] + '/attributes/' + this.changeDialogObj.attr_id, {
                        attr_name: this.changeDialogObj.attr_name,
                        attr_sel: this.activeName
                    });
                    this.changeDialog = false;
                    if(resp.data.meta.status === 200) {
                        this.$message.success(resp.data.meta.msg);
                        this.changeDialogObj = resp.data.data;
                        this.getProps();
                    } else {
                        this.$message.error(resp.data.meta.msg);
                    }
                } else {
                    this.$message.error('请按照要求填写数据');
                }
            })
        },
        async deleteParamById(id) {
            const resp = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).catch(err => err);
            if(resp == 'confirm') {
                const res = await this.$http.delete('categories/' + this.selectIds[2] + '/attributes/' + id);
                if(res.data.meta.status === 200) {
                    this.$message.success(res.data.meta.msg);
                    this.getProps();
                } else {
                    this.$message.error(res.data.meta.msg);
                }
                
            } else {
                this.$message.info('已取消删除');
            }
        },
        showInput(paraminfo) {
            paraminfo.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async setParamsAttributes(paraminfo) {
            const resp = await this.$http.put('categories/' + this.selectIds[2] + '/attributes/' + paraminfo.attr_id, {
                    attr_name: paraminfo.attr_name,
                    attr_sel: paraminfo.attr_sel,
                    attr_vals: paraminfo.attr_vals.join(' ')
                });
                if(resp.data.meta.status === 200) {
                    this.$message.success(resp.data.meta.msg);
                } else {
                    this.$message.error(resp.data.meta.msg);
                    this.getProps();
                }
        },
        showButton(paraminfo) {
            if(paraminfo.inputValue.trim().length !== 0) {
                paraminfo.attr_vals.push(paraminfo.inputValue.trim());
                this.setParamsAttributes(paraminfo);
            }
            paraminfo.inputValue = '';
            paraminfo.inputVisible = false;
        },
        removeAttrbute(paraminfo, index) {
            paraminfo.attr_vals.splice(index, 1);
            this.setParamsAttributes(paraminfo);
        }
    },
    computed: {
        btnShow() {
            return this.selectIds.length !== 3;
        },
        dialogTitle() {
            return this.activeName == 'many' ? '动态参数' : '静态属性';
        }
    },
    created() {
        this.getCategoryList();
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
.select{
    margin: 15px;
}
.el-table {
    margin-top: 15px;
    font-size: 12px;
}
.el-tag{
    margin-right: 15px;
}
.input-style{
    width: 150px;
}
</style>