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
                        <el-row>
                            <el-col :span="5">
                                123
                            </el-col>
                            <el-col :span="19">123</el-col>
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
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click='editRolesDialong(scope.row)'>
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配角色</el-button>
                    </template>
                </el-table-column>


            </el-table>












        </el-card>



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





    </div>
</template>

<script>
    import { getRoleslist, getaddRoles, editRoles } from 'network/right.js';
    export default {
        name: 'Roles',
        data() {
            return {
                rolesList: [],
                addRolesblooen: false,
                editRolesblooen: false,
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
                console.log(data);
                this.editForm.id = data.id
                this.editForm.roleName = data.roleName
                this.editForm.roleDesc = data.roleDesc
            },


            addRoles() {
                this.addRolesblooen = true
            },
            editRolesclose() {
                this.$refs.rolesform.resetFields();
            },
            editRolescloses() {
                this.$refs.editform.resetFields();
            },
            addRoless() {
                this.$refs.rolesform.validate(async valid => {
                    if (!valid) return
                    getaddRoles(this.rolesForm).then(res => {
                        console.log(res);
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
            editRoles() {
                this.$refs.editform.validate(valid => {
                    if (!valid) return
                    editRoles(this.editForm.id, this.editForm).then(res => {
                        console.log(res);
                    })

                })

            }



        }
    }
</script>

<style scoped>

</style>