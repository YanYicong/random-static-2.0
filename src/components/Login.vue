<template>
  <div class="background">
    <div class="index-logo">
      <img src="/public/login_logo.jpg"/>
    </div>
    <div class="login-register-container">
      <router-view/>
    </div>
    <div class="footer">
      <p>版权所有 © 2024 CC</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LoginInput from './LoginInput.vue';
import Register from './Register.vue';
</script>

<style scoped>
.background {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background-image: url('/sign_up_bg.jpg');
  background-size: cover;
  background-position: center;
}

.index-logo {
  display: flex;
  justify-content: center;
  padding: 10px;
  margin-bottom: 30px; /* 向下移动 */
}

.index-logo img {
  width: 150px;
  height: 150px;
  border-radius: 50%; /* 使图片变成圆形 */
  object-fit: cover;
}

.login-register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-bottom: 5px; /* 减小下边距 */
  padding: 5px;
}

.footer {
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.5); /* 半透明背景 */
}
</style>
