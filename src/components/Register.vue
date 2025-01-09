<template>
  <el-card class="register-card">
    <el-form>
      <el-form-item>
        <el-input placeholder="用户名" v-model="username" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="密码" v-model="password" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="确认密码" v-model="confirmPassword" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="邮箱" v-model="email" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="验证码" v-model="captcha" class="register-auth"/>
        <el-button type="info" @click="getCaptcha" :disabled="isButtonDisabled" class="register-auth">{{ buttonText }}</el-button>
      </el-form-item>
      <el-form-item>
        <router-link to="/random/login">
          <el-button type="default" class="register-button">取消</el-button>
        </router-link>
          <el-button type="primary" @click="handleRegister" class="register-button">确认</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";
import {ElMessage} from "element-plus";
import {getEmailCaptcha, register} from "~/api/user";
import router from "~/router";
import {startLoading, stopLoading} from "~/utils/utils";

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const captcha = ref('');
const isButtonDisabled = ref(false)
const buttonText = ref('获取验证码');
let countdown = 60;

/**
 * 获取验证码
 * @returns {Promise<void>}
 */
const getCaptcha = async () => {
  if(email.value != ''){
    startLoading();
    const {data} = await getEmailCaptcha(email.value);
    if (data.code == 200) {
      ElMessage.success("获取成功，请查看邮件")
      stopLoading()
      if (isButtonDisabled.value) return;
      isButtonDisabled.value = true;
      const timer = setInterval(() => {
        countdown--;
        buttonText.value = `${countdown}秒后重新获取`;

        if (countdown <= 0) {
          clearInterval(timer); // 清除定时器
          isButtonDisabled.value = false; // 启用按钮
          buttonText.value = '获取验证码'; // 恢复按钮文本
          countdown = 60; // 重置倒计时
        }
      }, 1000);
      return;
    }else{
      stopLoading()
      ElMessage.error(data.msg);
      return;
    }
  }else {
    ElMessage.error("请输入邮箱");
  }

}
/**
 * 注册
 * @returns {Promise<void>}
 */
const handleRegister = async () => {
  if(username.value == '' || password.value == '' || confirmPassword.value == '' || email.value == '' || captcha.value == '' ){
    ElMessage.error("当前表单不可存在空值");
    return;
  }
  if (password.value != confirmPassword.value) {
    ElMessage.error("两次输入密码不一致");
    return;
  }
  startLoading();
  const param = {
    username: username.value,
    password: password.value,
    email: email.value,
  }
  const emailCaptcha = captcha.value;
  try {
    const {data} = await register({param, emailCaptcha});
    if (data.code == 200) {
      ElMessage.success(data.msg);
      stopLoading();
      goLogin();
    } else {
      ElMessage.error(data.msg);
      stopLoading();
    }
  }catch (error) {
    ElMessage.error(error.message);
    stopLoading();
  }
};

const goLogin = () =>{
  router.push('/random/login');
}

</script>

<style scoped>
.register-card {
  width: 330px;
  padding: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  border: 0px solid;
  margin: 0px;
}
.register-button{
  width: 100px;
  margin-right: 7px;
  margin-left:25px;
  margin-bottom: 10px;
}
.register-test{
  width: 80%;
  margin-left: 25px;
}
.register-auth{
  width: 100px;
  margin-right: 7px;
  margin-left: 25px;
}
</style>
