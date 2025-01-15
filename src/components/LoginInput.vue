<template>
  <el-card class="login-card">
    <h1>您辛苦了</h1>
    <el-form @keydown.enter="handleLogin">
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
          style="cursor: pointer; margin-left: 5px; width: 80px; height: 30px;"
        />
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button" style="width: 234px">登录</el-button>
        <router-link to="/randomPage/register">
          <el-button type="default" class="login-button" >注册</el-button>
        </router-link>
        <router-link to="/randomPage/forget">
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
const captchaSrc = ref('');


/**
 * 初始化验证码
 */
const refreshCaptcha = async () => {
  // 添加随机参数，避免浏览器缓存
  const timestamp = new Date().getTime();
  captchaSrc.value = `/random/api/captcha?timestamp=${timestamp}`;
};

// 页面加载时自动刷新验证码
refreshCaptcha();

/**
 * 登录
 * @returns {Promise<void>}
 */
 const handleLogin = async () => {
  if(username.value == '' || password.value == '' || captcha.value == '') {
    ElMessage.error("当前表单不可存在空值");
    return;
  }
  startLoading();
  const user = {
     username : username.value,
     password : password.value,
  }
  const captchaParam = captcha.value;
  try {
    const {data, headers} = await login({user, captchaParam});
    console.log(data);
      // 将 token 保存到 localStorage（持久存储于客户端浏览器中的键值对容器，必须手动删除）
    localStorage.setItem('token', headers['token']);
    if (data.code == 200) {
      goIndex();
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error){
    stopLoading();
    console.log(error);
    ElMessage.error("登录异常");
  }
  stopLoading();
};

 const goIndex = () => {
   router.push('/randomPage/home/index');
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
