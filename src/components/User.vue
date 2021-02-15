<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                {{getmenus.authName}}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in getmenus.children" :key="item.id">
                {{item.authName}}
            </el-breadcrumb-item>

        </el-breadcrumb>

        <el-card class="box-card">
            <el-row :gutter='20'>
                <el-col :span='7'>

                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">

                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-col>
            </el-row>



            <el-table :data="userlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop='username'></el-table-column>
                <el-table-column label="邮箱" prop='email'></el-table-column>
                <el-table-column label="电话" prop='mobile'></el-table-column>
                <el-table-column label="角色" prop='role_name'></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="pink"
                            @change="userStatechange(scope.row)">
                        </el-switch>
                        <!-- {{scope.row}} -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改用户信息 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="editUserdialong(scope.row.id)">
                        </el-button>
                        <!-- 删除用户 -->

                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)">
                        </el-button>

                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>


            <!-- 分页区域 -->


            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>



        </el-card>

        <!-- 这里是添加用户的提示框 -->

        <el-dialog title="添加用户" :visible.sync="addUserblooen" width="50%" @close='addDialongClose'>
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserblooen = false">取 消</el-button>
                <el-button type="primary" @click="addUsers">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 这里是编辑用户的提示框 -->

        <el-dialog title="编辑用户" :visible.sync="editUserblooen" width="50%" @close='editDialongClose'>
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled> </el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserblooen = false">取 消</el-button>
                <el-button type="primary" @click="editUsers">确 定</el-button>
            </span>
        </el-dialog>




    </div>
</template>

<script>
    import { getMenusList, getUserList } from 'network/menus.js'
    export default {
        name: 'User',
        data() {

            // 验证邮箱的校验规则
            var checkEamil = (rule, value, cb) => {
                //验证邮箱的正则
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))

            }
            // 验证手机号码的正则

            var checkMobile = (rule, value, cb) => {

                const regMobile = /^(0|86|17951)?(13[0-9]|15[01223456789]|17[678]|18[0-9]|14[5-7])[0-9]{8}$/
                if (regMobile.test(value)) {
                    return cb()
                }

                cb(new Error('请输入合法的手机号码'))

            }
            return {
                getmenus: {},
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                addUserblooen: false,
                editUserblooen: false,
                addForm: {
                    username: '',
                    password: '',
                    mobile: '',
                    email: ''
                },
                editForm: {},




                //添加用户名验证规则
                addFormrules: {
                    username: [{ required: true, message: '请输入登录名', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }],
                    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEamil, trigger: 'blur' }],
                    mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }],
                },
                editFormrules: {

                    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEamil, trigger: 'blur' }],
                    mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }],
                }
            }
        },
        created() {
            getMenusList().then(res => {
                this.getmenus = res.data[0]
                // console.log(this.getmenus);
            })
            this.getUserList()

        },
        methods: {
            // 监听分页事件
            handleSizeChange(newSize) {
                // console.log(newSize);
                this.queryInfo.pagesize = newSize
                this.getUserList();

            },
            //监听页码值发生改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList()
            },
            //添加用户
            addUser() {
                this.addUserblooen = true
            },
            //编辑用户

            async editUserdialong(id) {
                const { data: res } = await this.$http.get('users/' + id);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户信息失败')
                }
                // console.log(res);
                this.editForm = res.data;
                this.editUserblooen = true;

            },
            // 监听添加用户的关闭事件
            addDialongClose() {
                this.$refs.addFormRef.resetFields()

            },
            editDialongClose() {
                this.$refs.editFormRef.resetFields()
            },
            // 点击按钮，添加新用户
            addUsers() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return

                    const { data: res } = await this.$http.post('users', this.addForm)

                    if (res.meta.status !== 201) { this.$message.error('添加用户失败') }
                    this.$message.success('添加用户成功');
                    console.log(this.addForm);
                    // 关闭添加表单
                    this.addUserblooen = false;
                    // 重新刷新用户列表
                    this.getUserList()

                })

            },

            editUsers() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
                    if (res.meta.status !== 200) { this.$message.error('修改用户失败') }
                    // console.log(res);
                    this.editForm = res.data

                    this.$message.success('修改用户成功');
                    // 关闭添加表单
                    this.editUserblooen = false;
                    // 重新刷新用户列表
                    this.getUserList()
                })

            },




            getUserList() {
                getUserList(this.queryInfo).then(res => {
                    this.userlist = res.data.users;
                    this.total = res.data.total
                    // console.log(this.userlist);

                })
            },

            // 监测switch开关的状态
            async userStatechange(data) {
                const { data: res } = await this.$http.put(`users/${data.id}/state/${data.mg_state}`)
                if (res.meta.status !== 200) {
                    data.mg_state = !data.mg_state
                    return this.$message.error('更新失败')
                } else {
                    return this.$message.success('更新成功')
                }

            },
            // 删除用户的方法

            async removeUser(id) {
                const userdelete = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (userdelete !== 'confirm') {
                    return this.$message.info('已经取消了删除')
                }
                console.log('确认了删除');
                const { data: res } = await this.$http.delete('users/' + id);
                if (res.meta.status !== 200) {
                    return this.$message.error('删除用户失败')
                }
                this.$message.success('删除用户成功');
                this.getUserList()

            }

        }
    }
</script>

<style scoped>

</style>