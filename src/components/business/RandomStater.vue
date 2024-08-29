<template>
  <el-container class="container">
    <el-tag class="text-box">{{ inputValue }}</el-tag>
    <el-select
      v-model="selectedCategory"
      placeholder="请选择..."
      @change="onCategoryChange"
      class="dropdown"
      :loading="loading"
      value-key="id"
    >
      <el-option
        v-for="category in categories"
        :key="category.id"
        :label="category.categoryName"
        :value="category"
      ></el-option>
    </el-select>
    <el-button type="primary" class="button" @click="startRandom" :loading="loading">开始</el-button>
    <div class="random-texts">
      <div
        v-for="(option, index) in selectedOptions"
        :key="index"
        :style="option.style"
        class="text"
      >
        {{ option.content }}
      </div>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {getCategoriesAndOptions, getRandomResultContext} from "~/api/start";
import {ElMessage} from "element-plus";

const inputValue = ref("(▔—▔)");
const categories = ref([]);
const selectedCategory = ref(null);
const selectedOptions = ref([]);
const loading = ref(false);

/**
 * 获取下拉框内容
 */
const fetchCategories = async () => {
  const params = {
    isApply : 0,
  };
  try {
    const {data} = (await getCategoriesAndOptions(params)) as any;
    if(data.code != 200){
      ElMessage.error(data.msg);
    }
    categories.value = data.data;
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }
};

/**
 * 开始执行
 */
const startRandom = async () => {
  try {
    const categoryId = selectedCategory.value.id;
    const {data} = (await getRandomResultContext(categoryId)) as any;
    if(data.code != 200){
      ElMessage.error(data.msg);
      return;
    }
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }

  const options = selectedCategory.value.option;
  // 每个选项显示的时间 (毫秒)
  const displayInterval = 70;
  // 总共显示时间 (毫秒)
  const displayDuration = 2000;
  const startTime = Date.now();
  // 在三秒内循环显示 options 中的内容
  loading.value = true;
  while (Date.now() - startTime < displayDuration) {
    for (const option of options) {
      inputValue.value = option.optionName;
      await new Promise((resolve) => setTimeout(resolve, displayInterval));
      if (Date.now() - startTime >= displayDuration) break;
    }
  }
  // 三秒后显示结果
  loading.value = false;
  inputValue.value = data.data.optionName;
}

//生成漂浮字
const generateRandomTexts = (options) => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FFBD33", "#33FFBD",
    "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4", "#FF5722",
    "#673AB7", "#E91E63", "#FFC107", "#03A9F4", "#F44336",
    "#FF33A1", "#FF6E33", "#6B33FF", "#33A1FF", "#FF33D4"
  ];
  const positions = new Set<string>();

  const adjustedOptions = [];
  const optionCount = options.length;

  // 根据标准数量调整显示的选项数量
  if (optionCount < 20) {
    // 选项少于20个时，重复填充
    for (let i = 0; i < 20; i++) {
      adjustedOptions.push(options[i % optionCount]);
    }
  } else if (optionCount > 20) {
    // 选项多于20个时，随机减少
    const shuffled = options.sort(() => 0.5 - Math.random());
    adjustedOptions.push(...shuffled.slice(0, 20));
  } else {
    adjustedOptions.push(...options);
  }

  selectedOptions.value = adjustedOptions.map((option) => {
    let left, top;
    do {
      left = `${Math.floor(Math.random() * 80)}%`;
      top = `${Math.floor(Math.random() * 80)}%`;
    } while (positions.has(`${left}-${top}`));

    positions.add(`${left}-${top}`);

    return {
      content: option.optionName,
      style: {
        color: colors[Math.floor(Math.random() * colors.length)],
        fontSize: `${Math.random() * 50 + 10}px`,
        position: "absolute",
        left,
        top,
      },
    };
  });
};

// 下拉框当前选中项
const onCategoryChange = () => {
  if (selectedCategory.value && selectedCategory.value.option) {
      generateRandomTexts(selectedCategory.value.option);
  }
};

// 默认下拉框
onMounted(() => {
  fetchCategories().then(() => {
    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0];
      onCategoryChange();
    }
  });
});

//漂浮字晃动
window.addEventListener("mousemove", (e) => {
  selectedOptions.value.forEach((option) => {
    option.style.transform = `translate(${Math.sin(e.clientX * 0.05) * 3}px, ${
      Math.sin(e.clientY * 0.05) * 5
    }px)`;
  });
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.text-box {
  margin-bottom: 1rem;
  width: 30%;
  height: 20%;
  font-size: 24px;
  padding: 12px;
  text-align: center;
}

.dropdown,
.button {
  margin-bottom: 1rem;
  width: 20%;
  height: 10%;
}

.random-texts {
  position: relative;
  width: 100%;
  height: 100%;
}

.text {
  transition: transform 0.2s ease-in-out;
  user-select: none;
}
</style>
