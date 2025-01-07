<template>
  <el-card class="login-card">
    <h1>您辛苦了</h1>
    <el-form>
      <el-form-item>
        <el-input placeholder="用户ID/邮箱" v-model="username" class="login-test"/>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="密码" v-model="password" class="login-test"/>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="验证码" v-model="captcha" class="login-auth"/>
        <img
          :src="captchaSrc"
          @click="refreshCaptcha"
          alt="验证码"
          style="cursor: pointer; margin-left: 10px;"
        />
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button" style="width: 234px">登录</el-button>
        <router-link to="/random/register">
          <el-button type="default" class="login-button" >注册</el-button>
        </router-link>
        <router-link to="/random/forget">
          <el-button type="default" class="login-button">忘记密码</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage} from "element-plus";
import {login} from "~/api/user";
import {startLoading, stopLoading} from "~/utils/utils";
const router = useRouter();

const username = ref('');
const password = ref('');
const captcha = ref('');

/**
 * 登录
 * @returns {Promise<void>}
 */
 const handleLogin = async () => {
  startLoading();
   const param = {
     username : username.value,
     password : password.value,
   }
  try {
    const {data, headers} = await login(param);
    console.log(data);
    // 将 token 保存到 localStorage
    localStorage.setItem('token', headers['token']);
    if (data.code == 200) {
      goIndex();
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error){
    stopLoading();
    ElMessage.error("登录异常");
  }
  stopLoading();
};

 const goIndex = () => {
   router.push('/random/home/index');
 }
</script>

<style scoped>
.login-card {
  width: 330px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border: 0px solid;
}
.login-button{
  width: 100px;
  margin-right: 10px;
  margin-left:25px;
  margin-bottom: 10px;
}
.login-test{
  width: 80%;
  margin-left: 25px;
}
.login-auth{
  width: 50%;
  margin-right: 5px;
  margin-left: 25px;
}
</style>
