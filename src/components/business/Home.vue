<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <BaseSide/>
      <div class="content-container">
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  display: flex;
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}

.content-container {
  flex: 1; /* Take up remaining space */
  padding: 1rem; /* Adjust as needed */
  overflow: auto; /* Handle overflow if content is too large */
}
</style>
