<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                商品管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                分类参数
            </el-breadcrumb-item>

        </el-breadcrumb>

        <el-card>
            <!-- 头部警告区 -->
            <el-alert title="注意：只允许为第三级分类设置相关的参数" type="warning" :closable="false" show-icon> </el-alert>
            <!-- 选择商品分类 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类联级选择框 -->
                    <el-cascader v-model="selectedCatKeys" :options="catelist" :props="cateProps"
                        @change="handleChange">
                    </el-cascader>

                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyList" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                                    @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>



                            </template>


                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type='index'></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                    @click="showDialog(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                    @click="deleteParams(scope.row.attr_id)"> 删除</el-button>
                            </template>

                        </el-table-column>
                    </el-table>


                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加属性</el-button>
                    <el-table :data="onlyList" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                                    @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>



                            </template>


                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type='index'></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                    @click="showDialog(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                    @click="deleteParams(scope.row.attr_id)"> 删除</el-button>
                            </template>

                        </el-table-column>
                    </el-table>



                </el-tab-pane>

            </el-tabs>
        </el-card>


        <!-- 添加参数的对话框 -->

        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改对话框 -->
        <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>





    </div>
</template>

<script>
    import { deleteParams } from 'network/good.js'
    export default {
        name: 'Params',
        data() {
            return {
                //商品分类列表
                catelist: [],
                //配置级联选择框的props
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'

                },
                // 级联选择框双向绑定的数组
                selectedCatKeys: [],
                // 被激活的页签名称
                activeName: 'many',
                // 动态参数面板数据
                manyList: [],
                //静态参数面板
                onlyList: [],
                addDialogVisible: false,
                //添加表单的数据
                addForm: {
                    attr_name: ''
                },
                editDialogVisible: false,
                editForm: {
                    attr_name: ''
                },
                addFormRules: {
                    attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }, { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }]
                },
                editFormRules: {
                    attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }, { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }]
                },



            }
        },
        created() {
            //获取所有的商品分类
            this.getCateList()
        },
        methods: {
            // 获取所有的商品分类
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败！')
                }
                this.catelist = res.data

            },
            //级联选择框选中项变化触发
            handleChange() {
                this.getParamsData()

            },

            async getParamsData() {

                if (this.selectedCatKeys.length !== 3) {
                    this.selectedCatKeys = []
                    this.manyList = []
                    this.onlyList = []
                    this.$message.warning('未查询到参数，是否选择为三级商品')

                    return
                }
                //证明选择的是三级分类
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                })
                // console.log(res.data);
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

                    //  控制文本框的显示和隐藏
                    item.inputVisible = false
                    // 文本框中输入的值
                    item.inputValue = ''
                })
                console.log(res.data);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取失败')
                }

                if (this.activeName === 'many') {
                    this.manyList = res.data
                } else {
                    this.onlyList = res.data
                }
            },

            // tag标签页被点击
            handleTabClick() {
                this.getParamsData()
            },

            addDialogClose() {
                this.$refs.addFormRef.resetFields()
            },
            editDialogClose() {
                this.$refs.editFormRef.resetFields()
                this.editForm = {
                    attr_name: ''
                }
            },
            // 点击按钮添加参数
            addParams() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 201) {
                        return this.message.error('添加参数失败')
                    }
                    this.$message.success('添加成功')
                    this.addDialogVisible = false
                    this.getParamsData()
                })

            },

            async showDialog(id) {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
                    params: {
                        attr_sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数失败')
                }
                this.editDialogVisible = true
                this.editForm = res.data
            },
            async editParams() {
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName,
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('编辑失败！')
                }
                this.$message.success('修改成功')
                this.editDialogVisible = false
                this.getParamsData()

            },
            deleteParams(attr_id) {
                this.$confirm('确认删除该' + this.titleText + '吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    deleteParams(this.cateId, attr_id).then(res => {
                        if (res.meta.status !== 200) {
                            return this.$message.error('删除失败')
                        }
                        this.$message.success('删除成功')
                        this.getParamsData()
                    })

                }).catch(() => {
                    this.$message.info('已取消删除');
                })
            },
            // 文本框失去焦点 或者按下 都会触发
            async handleInputConfirm(row) {

                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                //用户输入了内容
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                // 需要发起请求提交到后端
                this.saveAttrVals(row);
            },
            showInput(row) {
                row.inputVisible = true
                // 让文本框自动获得焦点
                // $nextTick() 方法的作用，就是当页面的元素被重新渲染之后，才会指定回调函数中的代码

                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            async saveAttrVals(row) {
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('添加失败')
                }

                this.$message.success('修改成功')
            },

            // 删除对应参数的可选项
            handleClose(i, row) {
                row.attr_vals.splice(i, 1)
                this.saveAttrVals(row)
            }



        },
        computed: {
            // 如果按钮需要被禁用则返回 true 否则为false
            isBtnDisabled() {
                if (this.selectedCatKeys.length !== 3) {
                    return true
                }

                return false
            },
            //当前选中的三级Id
            cateId() {

                if (this.selectedCatKeys.length === 3) {
                    return this.selectedCatKeys[2]
                }
                return null
            },
            // 动态计算标题
            titleText() {
                if (this.activeName === 'many') {
                    return "动态参数"
                } else {
                    return "静态属性"
                }


            }
        }
    }
</script>

<style scoped>
    .cat_opt {
        margin: 15px 0;
    }

    .el-tag {
        margin: 10px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>