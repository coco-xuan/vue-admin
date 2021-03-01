<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                商品列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                添加商品
            </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视+图 -->
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>

            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTagLeave" @tab-click="tagClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                                @change="handleChange">
                            </el-cascader>

                        </el-form-item>




                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key='item.attr_id'>
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key='i' border></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key='item.attr_id'>
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action表示后台上传到的api地址 -->
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>

                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">

                        <!-- 富文本编译器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>


                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>


        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewShow" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: 'Add',
        data() {
            return {
                activeIndex: '0',
                // 添加商品的表单数据项
                addForm: {

                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    //图片的数组
                    pics: [],
                    // 商品的详情
                    goods_introduce: '',
                    attrs: []

                },
                // 分类列表
                cateList: [],
                cateValue: '',
                // 验证规则
                addFormRules: {
                    goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                    goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
                    goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
                    goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
                    goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
                },
                cateProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                //动态参数
                manyTabData: [],
                // 静态属性
                onlyTabData: [],
                uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewPath: '',
                previewShow: false,

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败')
                }
                this.cateList = res.data
                // console.log(this.cateList);
            },
            handleChange() {
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                    return
                }
                console.log(this.addForm.goods_cat);
            },
            // 切换标签时
            beforeTagLeave(activeName, oldActiveName) {

                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类')
                    return false
                }
            },
            async tagClick() {
                // console.log(this.activeIndex);
                // 证明访问的是动态参数面板
                if (this.activeIndex === '1') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'many'
                        }
                    })

                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数失败aaaa')
                    }

                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    })
                    this.manyTabData = res.data

                } else if (this.activeIndex === '2') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'only'
                        }
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取静态参数失败aaaa')
                    }
                    this.onlyTabData = res.data
                }
            },



            // 处理图片预览
            handlePreview(file) {
                this.previewPath = file.response.data.url
                this.previewShow = true
            },
            // 处理移除图片的事件
            handleRemove(file) {
                //  1. 获取将要删除的图片临时路径
                const filePath = file.response.data.tmp_path
                // 2. 从pics数组中，找到这个图片的索引值
                const i = this.addForm.pics.findIndex(x => x.pic === filePath)
                // 3. 调用数据的 splice 方法，把图片信息对象，从 pics数组中移除
                this.addForm.pics.splice(i, 1)
                console.log(this.addForm);

            },
            // 监听图片上传成功的操作
            handleSuccess(res) {
                // 1. 拼接得到的一个图片对象
                const picsInfo = { pic: res.data.tmp_path }

                // 2. 将图片信息对象 push到pics数组中
                this.addForm.pics.push(picsInfo)
            },

            // 添加商品
            add() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('填写必要的表单项')
                    }


                    // 执行添加商品的业务
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTabData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newInfo)

                    })
                    // 处理静态属性
                    this.onlyTabData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }

                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs = this.addForm.attrs
                    const { data: res } = await this.$http.post('goods', form)
                    console.log(res);
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加商品失败！')
                    }
                    this.$message.success('添加商品成功！')
                    this.$router.push('/goods')
                })
            }




        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        }
    }
</script>

<style scoped>
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .previewImg {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>