<template>
  <el-menu mode="vertical" class="header-container">
    <el-menu-item h="full" class="left-content">
      <router-link
        to="/randomPage/home/index"
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

<!--    <el-menu-item h="full" class="right-content">-->
<!--      <button class="border-none w-full bg-transparent cursor-pointer" style="font-size: 12px" @click="useRandomBase">-->
<!--        使用旧版-->
<!--      </button>-->
<!--    </el-menu-item>-->
    <el-menu-item h="full" class="right-content">
      <button class="border-none w-full bg-transparent cursor-pointer" style="font-size: 12px" @click="exit">
        注销
      </button>
    </el-menu-item>
  </el-menu>
  <el-divider class="header-line"/>
</template>

<script setup lang="ts">
import { toggleDark } from "~/composables";
import {logout} from "~/api/user";
import router from "~/router";
import {ElMessage} from "element-plus";
import {startLoading, stopLoading} from "~/utils/utils";
import {onMounted} from "vue";


// 跳转到旧版
const useRandomBase = () => {
  // 当前页面
  // window.location.href = "http://localhost:8001/random/index.html";
  // 新页面
  window.open("http://localhost:8001/random/index.html", "_blank")
}

/**
 * 注销
 */
const exit = async () => {
  startLoading();

  try {
    const { data } = await logout({});
    if (data.code === 200) {
      //从localStorage中删除token
      localStorage.removeItem("token");
      await router.push('/randomPage/login');
      // 跳转完成后再刷新页面
      window.location.reload();
    } else {
      ElMessage.error(data.msg);
    }
  } catch (error) {
    ElMessage.error("系统错误");
  } finally {
    stopLoading();
  }
};

onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push('/randomPage/login');
  }
});

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
