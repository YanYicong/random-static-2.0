<template>
  <el-card class="register-card">
    <el-form>
      <el-form-item>
        <el-input type="password" placeholder="新密码" v-model="password" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="确认密码" v-model="confirmPassword" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="邮箱" v-model="email" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="验证码" v-model="emailCaptcha" class="register-auth"/>
        <el-button type="info" @click="getCaptcha" :disabled="isButtonDisabled" class="register-auth">{{ buttonText }}</el-button>
      </el-form-item>
      <el-form-item>
        <router-link to="/randomPage/login">
          <el-button type="default" class="register-button">取消</el-button>
        </router-link>
          <el-button type="primary" @click="updatePassword" class="register-button">确认</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import {startLoading, stopLoading} from "~/utils/utils";
import {getEmailCaptcha, remakePassword} from "~/api/user";
import {ElMessage} from "element-plus";
import router from "~/router";

const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const emailCaptcha = ref('');
const isButtonDisabled = ref(false)
const buttonText = ref('获取验证码');
let countdown = 60;

/**
 * 获取邮箱验证码
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
 * 重置密码
 */
const updatePassword = async () => {
  if (password.value == '' || confirmPassword.value == '' || email.value == '' || emailCaptcha.value == '') {
    ElMessage.error("当前表单不可存在空值");
    return;
  }
  if (password.value != confirmPassword.value) {
    ElMessage.error("两次输入密码不一致");
    return;
  }
  startLoading();
  const param = {
    password: password.value,
    email: email.value,
  }
  const captcha = emailCaptcha.value
  try {
    const {data} = await remakePassword({param, captcha});
    if (data.code == 200) {
      ElMessage.success(data.msg);
      stopLoading();
      router.push('/randomPage/login');
    } else {
      ElMessage.error(data.msg);
      stopLoading();
    }
  } catch (error) {
    ElMessage.error(error.message);
    stopLoading();
  }
};
</script>

<style scoped>
.register-card {
  width: 330px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border: 0px solid;
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
