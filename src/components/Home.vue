<template>

    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/wang.jpg" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isToggle ? '64px':'200px' ">
                <div class=" toggle-button" @click="toggleClick">|||</div>


                <el-menu background-color="#313743" text-color="#fff" active-text-color="#409eff" :unique-opened="true"
                    :collapse="isToggle" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconList[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }} </span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id"
                            @click="pathClick('/'+subitem.path)">
                            <i class="el-icon-menu"></i>
                            <span>{{subitem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>


            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>


</template>

<script>
    import { getMenusList } from 'network/menus.js'
    export default {
        name: 'Home',
        data() {
            return {
                menusList: [],
                iconList: {
                    '125': 'iconfont icon-yonghuguanli',
                    '103': 'iconfont icon-quanxian',
                    '101': 'iconfont icon-dianpu',
                    '102': 'iconfont icon-el-icon-custom-order',
                    '145': 'iconfont icon-shujutongji'
                },
                isToggle: false,
                activePath: ""
            }
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            // 获取所有的左侧菜单
            async getMenuList() {
                const { data: res } = await this.$http.get('menus')
            },
            toggleClick() {
                this.isToggle = !this.isToggle
            },
            pathClick(res) {
                window.sessionStorage.setItem('activePath', res);
                this.activePath = res
                console.log(this.activePath);

            }
        },
        created() {

            getMenusList().then(res => {
                this.menusList = res.data;
                // console.log(this.menusList);
            });
            this.activePath = window.sessionStorage.getItem('activePath');
            if (this.activePath !== this.$route.path && this.$route.path !== '/goods/add') {
                this.activePath = this.$route.path;
            } else {
                this.activePath = window.sessionStorage.getItem('activePath')
            }

        },
        watch: {
            $route(to, from) {
                if (to.path === '/goods/add') {
                    this.activePath = '/goods'
                    window.sessionStorage.setItem('activePath', this.activePath);
                    return
                }
                this.activePath = to.path
                window.sessionStorage.setItem('activePath', this.activePath);

            }
        }
    }
</script>

<style scoped>
    .toggle-button {
        background-color: #313743;
        text-align: center;
        font-size: 18px;
        color: #fff;
        line-height: 24px;
        letter-spacing: 0.2em;
        cursor: pointer;
    }

    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #2b4b6b;
        display: flex;
        justify-content: space-between;
        padding-left: 5px;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }

    .el-header img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .el-header>div {
        display: flex;
        align-items: center;

    }

    .el-header>div>span {
        margin-left: 15px;
    }

    .el-aside {
        background-color: #313743;

    }

    .el-main {
        background-color: #eee;
        box-sizing: border-box;
    }

    .iconfont {
        margin-right: 10px;
    }

    .el-menu {
        border: 0;
    }


    .el-main {
        padding-top: 10px;
    }

    .el-tag {
        cursor: pointer;
        margin-bottom: 8px;
        margin-right: 8px;
    }
</style>