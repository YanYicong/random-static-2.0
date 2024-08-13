<template>
  <el-container class="container">
    <el-tag class="text-box">{{ inputValue }}</el-tag>
    <el-select v-model="selectedOption" placeholder="Select an option" @change="generateRandomTexts" class="dropdown">
      <el-option label="Option 1" value="Option 1"></el-option>
      <el-option label="Option 2" value="Option 2"></el-option>
    </el-select>
    <el-button type="primary" @click="handleClick" class="button">Submit</el-button>
    <div class="random-texts">
      <div
        v-for="(text, index) in randomTexts"
        :key="index"
        :style="text.style"
        class="text"
      >
        {{ text.content }}
      </div>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const inputValue = ref("Display Text");
const selectedOption = ref("Option 1");
const randomTexts = ref([]);

const generateRandomTexts = () => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FFBD33", "#33FFBD",
    "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4", "#FF5722",
    "#673AB7", "#E91E63", "#FFC107", "#03A9F4", "#F44336",
    "#FF33A1", "#FF6E33", "#6B33FF", "#33A1FF", "#FF33D4"
  ];
  const positions = new Set<string>();

  randomTexts.value = Array.from({ length: 20 }, () => {
    let left, top;
    do {
      left = `${Math.floor(Math.random() * 80)}%`;
      top = `${Math.floor(Math.random() * 80)}%`;
    } while (positions.has(`${left}-${top}`));

    positions.add(`${left}-${top}`);

    return {
      content: selectedOption.value,
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

onMounted(() => {
  generateRandomTexts();
});

window.addEventListener("mousemove", (e) => {
  randomTexts.value.forEach((text) => {
    text.style.transform = `translate(${Math.sin(e.clientX * 0.05) * 3}px, ${
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
  user-select: none; /* Prevent text selection */
}
</style>
