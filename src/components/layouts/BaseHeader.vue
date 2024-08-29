<template>
  <el-menu mode="vertical" class="header-container">
    <el-menu-item h="full" class="left-content">
      <router-link
        to="/random/home/index"
        style="display: block; height: 100%; width: 100%; text-decoration: none; font-size: 18px"
      >
      Random
      </router-link>
    </el-menu-item>
    <el-menu-item h="full" @click="toggleDark()" class="right-content">
      <button class="border-none w-full bg-transparent cursor-pointer">
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>

    <el-menu-item h="full" class="right-content">
      <button class="border-none w-full bg-transparent cursor-pointer" style="font-size: 12px" @click="useRandomBase">
        使用旧版
      </button>
    </el-menu-item>
    <el-menu-item h="full" class="right-content">
      <button class="border-none w-full bg-transparent cursor-pointer" style="font-size: 12px">
        注销
      </button>
    </el-menu-item>
  </el-menu>
  <el-divider class="header-line"/>
</template>

<script setup lang="ts">
import { toggleDark } from "~/composables";

// 跳转到旧版
const useRandomBase = () => {
  // 当前页面
  // window.location.href = "http://localhost:8001/random/index.html";
  // 新页面
  window.open("http://localhost:8001/random/index.html", "_blank")
}

</script>

<style scoped>

.header-container {
  display: flex;
  //justify-content: space-between;
  align-items: center;
  //padding: 0 1rem;
}

.right-content {
  //margin-left: auto;
}
.left-content {
  margin-right: auto;
}
.header-line{
margin: 0;
  padding: 0;
  height: 1px;
}
</style>
