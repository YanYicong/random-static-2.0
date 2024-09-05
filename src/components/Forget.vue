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
        <el-input placeholder="邮箱" v-model="email" class="register-auth"/>
        <el-button type="info" v-model="captcha" class="register-auth">获取</el-button>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="验证码" v-model="captcha" class="register-test"/>
      </el-form-item>
      <el-form-item>
        <router-link to="/random/login">
          <el-button type="default" class="register-button">取消</el-button>
        </router-link>
          <el-button type="primary" @click="register" class="register-button">确认</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const captcha = ref('');

/**
 * 重置密码
 */
const register = () => {

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
