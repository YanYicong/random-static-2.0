<template>
  <el-menu mode="horizontal" class="header-container">
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
      <button class="border-none w-full bg-transparent cursor-pointer" style="font-size: 12px">
        注销
      </button>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { toggleDark } from "~/composables";

</script>

<style scoped>

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.right-content {
  margin-left: auto;
}
.left-content {
  margin-right: auto;
}
</style>
