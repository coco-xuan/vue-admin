<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                权限管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                角色列表
            </el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>
            <el-row :gutter='20'>
                <el-col :span='4'>
                    <el-button type="primary" @click="addRoles">添加用户</el-button>
                </el-col>
            </el-row>

            <el-table :data="rolesList" style="width: 100%;" border stripe align="center">


                <!-- 展开列 -->
                <el-table-column type="expand" align="center">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter']"
                            v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightbyId(scope.row,item1.id)"> {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                                    :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightbyId(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning"
                                            closable @close="removeRightbyId(scope.row,item3.id)">
                                            {{item3.authName}} </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>

                        </el-row>

                    </template>

                </el-table-column>

                <!-- 索引列 -->
                <el-table-column label="#" type="index" align="center">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center">
                </el-table-column>


                <el-table-column prop="roleDesc" label="角色描述" align="center">
                </el-table-column>


                <el-table-column label="操作" align="center" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                            @click='editRolesDialong(scope.row.id)'>
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click='deleteAaa(scope.row.id)'>删除
                        </el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting"
                            @click="showSetRightDialong(scope.row)">分配角色
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>

        </el-card>

        <!-- 添加用户 -->


        <el-dialog title="提示" width="30%" :visible.sync="addRolesblooen" @close="editRolesclose">
            <el-form ref="rolesform" label-width="80px" :model="rolesForm" :rules="addRolesRules">
                <el-form-item label="名称职位" prop="roleName">
                    <el-input v-model="rolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="职位描述" prop="roleDesc">
                    <el-input v-model="rolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesblooen = false">取 消</el-button>
                <el-button type="primary" @click="addRoless">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户 -->

        <el-dialog title="提示" width="30%" :visible.sync="editRolesblooen" @close="editRolescloses">
            <el-form :model='editForm' :rules='editRules' ref='editform'>
                <el-form-item label="名称职位" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="职位描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesblooen = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限 -->

        <el-dialog title="提示" width="30%" :visible.sync="setRightblooen" @close="setRightClosed">
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightblooen = false">取 消</el-button>
                <el-button type="primary" @click="setRight">确 定</el-button>
            </span>
        </el-dialog>




    </div>
</template>

<script>
    import { getRoleslist, getaddRoles, editRoles, editSearch, deleteRoles, deleteThree, getRight } from 'network/right.js';
    export default {
        name: 'Roles',
        data() {
            return {
                rolesList: [],
                addRolesblooen: false,
                editRolesblooen: false,
                setRightblooen: false,
                rightslist: [],
                // 树形控件的属性绑定
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                //默认选中的节点id值数组
                defKeys: [],
                roleId: '',
                rolesForm: {
                    id: '',
                    roleName: '',
                    roleDesc: ''
                },
                editForm: {},
                addRolesRules: {
                    roleName: [{ required: true, message: '请输入名称', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }],
                    roleDesc: [{ required: true, message: '请输入描述', trigger: 'blur' }, { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }]

                },
                editRules: {
                    roleName: [{ required: true, message: '请输入名称', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }],
                    roleDesc: [{ required: true, message: '请输入描述', trigger: 'blur' }, { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }]

                }
            }
        },
        created() {
            this.getRoles()
        },
        methods: {
            getRoles() {
                getRoleslist().then(res => {
                    // console.log(res);
                    this.rolesList = res.data
                    // console.log(this.rolesList);
                })
            },
            editRolesDialong(data) {
                this.editRolesblooen = true;
                editSearch(data).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('无法查询该用户，无法编辑')
                    }

                    this.editForm = res.data
                })

            },


            addRoles() {
                this.addRolesblooen = true
            },
            // 重置增加用户的dialong规则
            editRolesclose() {
                this.$refs.rolesform.resetFields();
            },
            // 重置编辑用户的dialong规则
            editRolescloses() {
                this.$refs.editform.resetFields();
            },
            // 增加用户的部分
            addRoless() {
                this.$refs.rolesform.validate(async valid => {
                    if (!valid) return
                    getaddRoles(this.rolesForm).then(res => {
                        // console.log(res);
                        if (res.meta.status !== 201) {
                            return this.$message.error('添加用户失败')
                        }
                        this.$message.success('添加成功')
                        // 关闭添加列表
                        this.addRolesblooen = false
                        // 刷新数据列表
                        this.getRoles()
                    })
                })
            },
            // 编辑用户的部分
            editRoles() {
                this.$refs.editform.validate(valid => {
                    if (!valid) return
                    editRoles(this.editForm.roleId, this.editForm).then(res => {
                        if (res.meta.status !== 200) {
                            return this.$message.error('修改失败')
                        }
                        this.editRolesblooen = false,
                            this.getRoles();
                        this.$message.success('修改成功')
                    })

                })

            },
            // 删除用户的提示
            deleteAaa(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRoles(id).then(res => {

                        if (res.meta.status !== 200) {
                            return this.$message.error('删除失败')
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                        this.getRoles()

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },



            // 删除三级标签
            async removeRightbyId(id1, id2) {
                // 弹框提示用户是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除')
                }


                deleteThree(id1.id, id2).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败')
                    }
                    id1.children = res.data
                })

            },
            //  展示分配权限的对话框
            showSetRightDialong(role) {
                this.roleId = role.id
                getRight().then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取权限失败')
                    }
                    // 获取到的权限保存到数组中

                    this.rightslist = res.data
                    console.log(this.rightslist);
                })

                this.getLeafKeys(role, this.defKeys)
                this.setRightblooen = true
            },

            // 获取三级节点的id值
            getLeafKeys(node, arr) {
                // 如果当前节点不包含children属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                // 递归循环数组
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })
            },

            // 监听分配权限的关闭事件
            setRightClosed() {
                this.defKeys = []
            },

            async setRight() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]

                // console.log(keys);
                const idStr = keys.join(',');
                const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败')
                }
                this.$message.success('分配权限成功')
                this.getRoles()
                this.setRightblooen = false

            }



        }
    }
</script>

<style scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }


    .vcenter {
        display: flex;
        align-items: center;
    }
</style>