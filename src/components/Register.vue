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
        <el-button type="info" v-model="captcha" class="register-auth">获取</el-button>
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
import {register} from "~/api/user";
import router from "~/router";

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const captcha = ref('');

/**
 * 注册
 * @returns {Promise<void>}
 */
const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    ElMessage.error("两次输入密码不一致");
    return;
  }
  const param = {
    username: username.value,
    password: password.value,
    email: email.value,
  }
      try {
        const {data} = await register(param);
        if(data.code == 200){
          ElMessage.success(data.msg);
          goLogin();
        }else {
          ElMessage.error(data.msg);
        }
        // 注册成功后可以直接跳转到登录页面
      } catch (error) {
        ElMessage.error(data.msg);
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
