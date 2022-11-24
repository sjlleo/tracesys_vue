<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
            label-position="left">

            <div class="title-container">
                <h3 class="title">Login Form</h3>
            </div>

            <el-form-item prop="username">
                <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text"
                    tabindex="1" autocomplete="on" prop="username" />
            </el-form-item>

            <el-tooltip content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">

                    <el-input ref="password" v-model="loginForm.password" type="password" placeholder="Password"
                        name="password" tabindex="2" autocomplete="on" @keyup.enter.native="handleLogin('loginForm')" maxlength="30" prop="password"/>
                </el-form-item>
            </el-tooltip>

            <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin('loginForm')">Login</el-button>
        </el-form>
    </div>
</template>

<script>

export default {
    name: "login",
    data() {
        var validateAccount = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error("账号不能为空"));
            } else {
                callback();
            }
        }
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                callback()
            }
        }
        return {
            loginRules: {
                username: [{validator: validateAccount, trigger: 'blur'}],
                password: [{validator: validatePass, trigger: 'blur'}],
            },
            loginForm: {
                username: "",
                password: "",
            }
        }
    },
    methods: {
        handleLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios({
                        url: "/api/login",
                        method: "post",
                        data: "username=" + this.loginForm.username + "&password=" + this.loginForm.password
                    }).then((res) => {
                        if (res.data.code == 200) {
                            console.log(res.data)
                            const storage = {
                                'name': this.loginForm.username,
                                'role': res.data.role
                            }
                            window.localStorage.setItem("user", JSON.stringify(storage))
                            switch (storage.role) {
                              case 1:
                              this.$router.push("/admin")
                              break
                              case 2:
                              this.$router.push("/user")
                              break
                            }
                        } else {
                            this.$message({type: 'error', message:'用户名或密码错误'})
                        }
                    })
                }
                else {
                    
                }
            })
            console.log(this.loginForm)
        }
    }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
