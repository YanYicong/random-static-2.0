<template>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <RouterLink to="/random/home/randomStater">
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>随机</template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/random/home/randomHistory">
      <el-menu-item index="3">
        <el-icon><document /></el-icon>
        <template #title>历史</template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/random/home/randomConfig">
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>配置</template>
      </el-menu-item>
    </RouterLink>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Document, Menu as IconMenu, Setting } from "@element-plus/icons-vue";
import { RouterLink } from "vue-router";

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
