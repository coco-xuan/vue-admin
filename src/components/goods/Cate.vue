<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                商品管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                商品分类
            </el-breadcrumb-item>

        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCate">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false"
                :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <!-- 排序 -->
                <template slot='order' slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row.cat_id)">编辑
                    </el-button>

                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除
                    </el-button>
                </template>


            </tree-table>



            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>



        <el-dialog title="提示" :visible.sync="addCateblooen" width="50%" @close="addCateDialogClose">
            <el-form status-icon ref="addCateFormRef" label-width="100px" :model="addCateForm"
                :rules="addCateFormRules">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options用来指定数据源 -->
                    <el-cascader v-model="selectedKeys" :options="parentCteList" @change="parentCateChanged"
                        :props="cascaderProps" clearable>
                    </el-cascader>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateblooen = false">取 消</el-button>
                <el-button type="primary" @click="addCateClick">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="editCateblooen" width="50%" @close="editCateDialogClose">
            <el-form status-icon ref="editCateFormRef" label-width="100px" :model="editCateForm"
                :rules="addCateFormRules">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateblooen = false">取 消</el-button>
                <el-button type="primary" @click="editCateClick">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
    import { getDeleteCate } from "network/good.js"
    export default {
        name: 'Cate',
        data() {
            return {
                // 商品分类的数据列表
                cateList: [],
                //查询条件
                querInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                total: 0,
                addCateblooen: false,
                // 添加分类表单的数据对象
                addCateForm: {
                    //将要添加的分类名称
                    cat_name: '',
                    // 父级分类的id
                    cat_pid: 0,
                    // 分类的等级 默认为1级
                    cat_level: 0,
                    cat_name: ''
                },

                // 为table指定列的定义
                columns: [{
                    label: '分类名称',
                    prop: 'cat_name'

                },
                {
                    label: '是否有效',
                    // 表示，当前定义为模板列
                    type: 'template',
                    // 表示当前的这一列使用的模板名称
                    template: 'isok'

                },
                // 排序
                {
                    label: "排序",
                    type: 'template',
                    template: 'order',

                },
                {
                    label: "操作",
                    type: 'template',
                    template: 'opt',

                }
                ],
                addCateFormRules: {

                    cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }, { min: 1, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }]

                },
                //  父级分类的列表
                parentCteList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    expandTrigger: "hover",
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 选中的父级id分类数组
                selectedKeys: [],
                editCateblooen: false,
                editCateForm: {

                }
            }

        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: this.querInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取失败');
                }
                // console.log(res.data);
                // 商品数据分类
                this.cateList = res.data.result
                // 商品页数
                this.total = res.data.total

            },
            //监听pagesize 改变
            handleSizeChange(newSize) {
                this.querInfo.pagesize = newSize
                this.getCateList()


            },
            // 监听pagenum的事件
            handleCurrentChange(newPage) {
                this.querInfo.pagenum = newPage
                this.getCateList()
            },
            // 添加分类
            addCate() {
                // 获取父级分类的数据列表
                this.getParentCateList()
                this.addCateblooen = true

            },
            // 获取父级分类的数据列表
            async getParentCateList() {
                const { data: res } = await this.$http.get('categories', {
                    params: {
                        type: 2
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取父级分类列表失败！')
                }
                console.log(res.data);
                this.parentCteList = res.data
            },
            // 选择项改变触发
            parentCateChanged() {
                // 如果selectedKeys 数组中的 length 大于0 证明选中了父级分类 
                // 反之就说明没选中任何父级
                if (this.selectedKeys.length > 0) {
                    // 父级的id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                    // 为当前的分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length;
                    return
                } else {
                    this.addCateForm.cat_pid = 0;
                    this.addCateForm.cat_level = 0;
                }



            },
            addCateClick() {

                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post('categories', this.addCateForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加分类失败')
                    }

                    this.$message.success('添加成功')
                    this.getCateList()
                    this.addCateblooen = false
                })
            },
            addCateDialogClose() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_level = 0;
                this.addCateForm.cat_pid = 0
            },
            editCateDialogClose() {
                this.$refs.editCateFormRef.resetFields()
            },
            async editCate(id) {
                this.editCateblooen = true
                const { data: res } = await this.$http.get('categories/' + id)
                this.editCateForm = res.data

            },
            async editCateClick() {
                const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, {
                    cat_name: this.editCateForm.cat_name
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('失败了啊')
                }
                this.$message.success('修改成功')
                this.getCateList()
                this.editCateblooen = false
            },
            async deleteCate(id) {

                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除')
                }
                getDeleteCate(id).then(res => {
                    console.log(res);
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败')
                    }
                    this.$message.success('删除成功')
                    this.getCateList()
                })


            }
        }

    }
</script>

<style scoped>
    .treeTable {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>