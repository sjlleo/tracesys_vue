<template>
  <div class="innerbox">
    <div class="icon">
      <svg viewBox="0 0 24 24" style="width: 100px">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z">
        </path>
      </svg>
      <h3>修改密码</h3>
    </div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px" status-icon>
      <el-form-item label="原密码" prop="oldpass">
        <el-input v-model="ruleForm.oldpass" maxlength="10" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm.password" maxlength="10" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" maxlength="10" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
  
<script>
export default {

  name: "UpdatePassword",

  methods: {

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: "post",
            url: "/api/user/updatePassword",
            data: { beforePassword: this.ruleForm.oldpass, newPassword: this.ruleForm.password }
          }).then(resp => {
            if (resp.data.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else if (resp.data.code == 400) {
              this.$message.error(resp.data.msg);
            } else {
              this.$message.error(resp.data.msg);
            }
          })
        } else {
          this.$message.error('请检查格式');
          return false;
        }
      });
    },
  },
  data() {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error("原密码不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {

        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldpass: '',
        password: '',
        checkPass: ''
      },
      rules: {
        oldpass: [{ validator: validateAccount, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
      }
    }
  }
}
</script>
  
<style scoped>
.innerbox {
  display: flex;
  text-align: center;
  margin: auto;
  width: 500px;
}
</style>