<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                权限管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                权限列表
            </el-breadcrumb-item>
        </el-breadcrumb>




        <el-card>
            <el-table :data="rightList" style="width: 100%;" border stripe align="center">
                <el-table-column label="#" type="index" align="center">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称" align="center">
                </el-table-column>
                <el-table-column prop="path" label="路径" align="center">
                </el-table-column>
                <el-table-column prop="level" label="权限等级" align="center">
                    <template v-slot="scope">
                        <!-- {{scope.row}} -->
                        <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.level==='1'">二级</el-tag>
                        <el-tag type="danger" v-if="scope.row.level==='2'">三级</el-tag>
                    </template>

                </el-table-column>

            </el-table>
        </el-card>
    </div>



</template>

<script>
    export default {
        name: 'Roles',
        data() {
            return {
                rightList: []
            }
        },
        methods: {


        },
        created() {

            this.$http.get('rights/list').then(res => {
                this.rightList = res.data.data
                // console.log(this.rightList);
            })

        }
    }
</script>

<style scoped>


</style>