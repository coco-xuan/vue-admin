<template>
    <div id="login">
        <div class="login_box">
            <!-- 头像 -->
            <div class="img_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form label-width="0" class="login-form" :model="loginForm" :rules='rules' ref="loginFormRef">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-mima" v-model="loginForm.password">
                    </el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="newForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [{ required: true, message: '请输入登录名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
                }
            }
        },
        methods: {
            newForm() {
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    const { data: res } = await this.$http.post("login", this.loginForm);
                    if (res.meta.status !== 200) return this.$message.error('失败');
                    this.$message.success("登录成功");
                    window.sessionStorage.setItem('token', res.data.token);
                    this.$router.push('/home')


                })
            }
        }
    }
</script>

<style>
    #login {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        border-radius: 3px;
        position: absolute;
        background-color: #fff;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .img_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;

        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        background-color: #fff;
        transform: translate(-50%, -50%);
    }

    .img_box img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }

    .login-form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: center;
    }
</style>