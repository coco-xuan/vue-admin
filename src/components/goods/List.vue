<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                商品管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                商品列表
            </el-breadcrumb-item>

        </el-breadcrumb>


        <el-card>
            <!-- 上面 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="querInfo.query" clearable @clear="getGooodsList">

                        <el-button slot="append" icon="el-icon-search" @click="getGooodsList"></el-button>
                    </el-input>

                </el-col>
                <el-col :span='4'>
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- Tab表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px" align="center"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="95px" align="center"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px" align="center">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>

                </el-table-column>
                <el-table-column label="操作" width="105px" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="editClick(scope.row.goods_id)">
                        </el-button> -->
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="removeById(scope.row.goods_id)"></el-button>
                    </template>

                </el-table-column>

            </el-table>



            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum" :page-sizes="[10,20,30]" :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>

        </el-card>

        <!-- <el-dialog title="编辑商品" :visible.sync="editdialogVisible" width="50%">

            <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="商品名称">
                    <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="editForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="editForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="重量">
                    <el-input v-model="editForm.goods_weight"></el-input>
                </el-form-item>

            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editFormClick">确 定</el-button>
            </span>
        </el-dialog> -->







    </div>
</template>

<script>
    export default {
        name: 'List',
        data() {
            return {
                querInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                // 商品列表
                goodsList: [],
                //    总数
                total: 0,
                // editdialogVisible: false,
                // editForm: {
                //     goods_name: '',
                //     goods_price: 0,
                //     goods_number: 0,
                //     goods_weight: 0
                // }

            }
        },
        created() {
            this.getGooodsList()
        }
        ,
        methods: {
            // 根据分页获取对应的数据列表
            async getGooodsList() {
                const { data: res } = await this.$http.get('goods', {
                    params: this.querInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败')
                }
                this.goodsList = res.data.goods
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.querInfo.pagesize = newSize
                this.getGooodsList()
            },
            handleCurrentChange(newPage) {
                this.querInfo.pagenum = newPage
                this.getGooodsList()
            },
            removeById(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // (`goods/${id}`)
                    const { data: res } = await this.$http.delete('goods/' + id)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败')
                    }
                    this.getGooodsList()
                    this.$message.success('删除成功')



                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            goAddpage() {
                this.$router.push('/goods/add')
            },


            // async editClick(row) {
            //     this.editdialogVisible = true
            //     const { data: res } = await this.$http.get('goods/' + row)
            //     if (res.meta.status !== 200) {
            //         return this.$message.error('获取商品信息失败！')
            //     }
            //     this.editForm = res.data
            //     console.log(res);
            // },
            // async editFormClick() {
            //     const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, {
            //         goods_name: this.editForm.goods_name,
            //         goods_price: this.editForm.goods_price,
            //         goods_number: this.editForm.goods_number,
            //         goods_weight: this.editForm.goods_weight,

            //     })

            //     console.log(res);
            // }

        }

    }
</script>

<style scoped>

</style>