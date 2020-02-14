<template>
    <div>
        <!-- 导航条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialog=true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolesList" :border="true" :stripe="true">
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row
                            :class="['border-bottom', index1 === 0 ? 'border-top' : '', 'vertical']"
                            v-for="(item1, index1) in scope.row.children"
                            :key="item1.id"
                        >
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag 
                                :closable="true"
                                @close="removeRightById(scope.row, item1.id)"
                                >{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!-- 二, 三级权限 -->
                            <el-col :span="19">
                                <!-- 二级 -->
                                <el-row
                                    :class="[index2 === 0 ? '': 'border-top', 'vertical']"
                                    v-for="(item2, index2) in item1.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag 
                                            type="success" 
                                            :closable="true"
                                            @close="removeRightById(scope.row, item2.id)"
                                        >{{ item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- 三级 -->
                                        <el-tag
                                            type="warning"
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            :closable="true"
                                            @close="removeRightById(scope.row, item3.id)"
                                        >{{ item3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="changeInfo(scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteRoleById(scope.row.id)"
                        >删除</el-button>
                        <el-button 
                            type="warning" 
                            icon="el-icon-setting" 
                            size="mini"
                            @click="setInfo(scope.row)"
                        >分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框 -->
        <add-dialog :show.sync="addDialog" @event="getRolesList"></add-dialog>

        <!-- 编辑角色对话框 -->
        <change-dialog :show.sync="changeDialog" @event="getRolesList" :datas="changeDialogObj"></change-dialog>

        <!-- 设置权限对话框 -->
        <set-dialog 
            :show.sync="setDialog" 
            @event="getRolesList" 
            :setDialogList="setDialogList" 
            :setRightsId="setRightsIdList" 
            :datas="setDialogObj"
        ></set-dialog>
    </div>
</template>

<script>
import addDialog from './AddRoleDialog.vue';
import changeDialog from './ChangeRoleDialog.vue';
import setDialog from './SetRightDialog.vue';
export default {
    name: 'roles',
    data() {
        return {
            rolesList: [],
            addDialog: false,
            changeDialog: false,
            changeDialogObj: {},
            setDialog: false,
            setDialogList: [],
            setRightsIdList: [],
            setDialogObj: {}
        };
    },
    methods: {
        async getRolesList() {
            const resp = await this.$http.get('roles');
            if (resp.data.meta.status === 200) {
                this.rolesList = resp.data.data;
            } else {
                this.$message.error(resp.data.meta.msg);
            }
        },
        changeInfo(roleinfo) {
            this.changeDialog = true;
            this.changeDialogObj = roleinfo;
        },
        async deleteRoleById(id) {
            const resp = await this.$confirm(
                '此操作将永久删除该角色, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err);
            if (resp == 'confirm') {
                const res = await this.$http.delete('roles/' + id);
                if (res.data.meta.status === 200) {
                    this.$message.success(res.data.meta.msg);
                    this.getRolesList();
                } else {
                    this.$message.error(res.data.meta.msg);
                }
            } else {
                this.$message.info('已取消删除');
            }
        },
        async removeRightById(role, rightsId) {
            const resp = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if(resp === 'confirm') {
                const res = await this.$http.delete('roles/' + role.id + '/rights/' + rightsId);
                if(res.data.meta.status === 200) {
                    this.$message.success(res.data.meta.msg);
                    // this.getRolesList();
                    role.children = res.data.data; // 后台直接返回最新的权限
                } else {
                    this.$message.error(res.data.meta.msg);
                }
            } else {
                return this.$message.info('已取消删除');
            }

        },
        async setInfo(roleinfo) {
            this.setDialog = true;
            this.setDialogObj = roleinfo;
            const resp = await this.$http.get('rights/tree');
            if(resp.data.meta.status === 200) {
                this.setDialogList = resp.data.data;
            } else {
                return this.$message.error(resp.data.meta.msg);
            }
            this.setRightsIdList = [];
            this.getSetRightsId(roleinfo, this.setRightsIdList);
        },
        getSetRightsId(node, arr) {
            if(!node.children) {
                arr.push(node.id);
                return ;
            } else {
                node.children.forEach(ele => {
                    this.getSetRightsId(ele, arr);
                })
            }
        }
    },
    components: {
        addDialog,
        changeDialog,
        setDialog
    },
    created() {
        this.getRolesList();
    }
};
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
.el-tag {
    margin: 7px;
}
.border-top {
    border-top: 1px solid #eee;
}
.border-bottom {
    border-bottom: 1px solid #eee;
}
.vertical {
    display: flex;
    align-items: center;
}
</style>