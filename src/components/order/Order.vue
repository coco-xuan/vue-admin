<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                订单管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                订单列表
            </el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>

            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <el-table :data="orderList" style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.pay_status === '0' ">未付款</el-tag>
                        <el-tag type=" success" v-else>已付款</el-tag>

                    </template>

                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="update_time">
                    <template slot-scope="scope">
                        {{scope.row.update_time | dateFormat}}
                    </template>

                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>



            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[10,15,20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>



        <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressClose">
            <el-form :model="addressForm" :rules="addressRoules" ref="addressRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <!-- <el-input v-model="addressForm.address1"></el-input> -->
                    <el-cascader :options="cityData" v-model="addressForm.address1" :props="addressProps"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>




        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">

            <span slot="footer">
                <el-button @click="progressVisible = false">取 消</el-button>
                <el-button type="primary" @click="progressVisible = false">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
    import cityData from './cityData.js'
    export default {
        name: 'Order',
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                orderList: [],
                addressVisible: false,
                addressForm: {},
                addressRoules: {
                    address1: [{ required: true, message: '请选项省市区', trigger: 'blur' }],
                    address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
                },
                addressForm: {
                    address1: [],
                    address2: ''
                },
                cityData,
                addressProps: {
                    expandTrigger: 'hover',
                    children: 'children'
                },
                progressVisible: false
            }
        },
        created() {
            this.getOrderList()
        },
        methods: {
            async getOrderList() {
                const { data: res } = await this.$http.get('orders', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取订单列表失败！')
                }
                // console.log(res);
                this.orderList = res.data.goods
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            // 展示修改地址的对话框
            showBox() {
                this.addressVisible = true
            },
            addressClose() {
                this.$refs.addressRef.resetFields()
            },
            async showProgressBox() {

                this.progressVisible = true

            }
        }
    }
</script>

<style scoped>
    .el-cascader {
        width: 100%;
    }
</style>