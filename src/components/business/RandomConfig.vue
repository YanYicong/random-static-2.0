<template>
  <div>
    <div class="ctrl-container">
      <el-button @click="downloadTemplate" type="primary">下载模板</el-button>
      <el-button @click="triggerFileInput" type="success">导入</el-button>
      <el-button @click="openRecycleBin" type="warning">回收站</el-button>

      <input type="file" ref="fileInput" style="display: none" accept=".xlsx" @change="handleFileUpload" />
    </div>

    <el-table :data="tableData" class="table">
      <el-table-column prop="groupName" label="组名" />
      <el-table-column prop="creationTime" label="创建时间" />
      <el-table-column prop="modificationTime" label="修改时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="viewDetails(scope.row)" type="text">详情</el-button>
          <el-button @click="deleteGroup(scope.row)" type="text" class="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 回收站模态窗口 -->
    <el-dialog v-model="isRecycleBinVisible" title="回收站" width="70%">
      <div class="recycle-bin-buttons">
        <el-button @click="deleteRecycleBinItems" type="danger">删除</el-button>
        <el-button @click="restoreRecycleBinItems" type="success">恢复</el-button>
        <el-button @click="restoreAllRecycleBinItems" type="success">全部恢复</el-button>
        <el-button @click="deleteAllRecycleBinItems" type="danger">全部删除</el-button>
      </div>
      <div class="table-container">
        <el-table :data="recycleBinData" class="table">
          <el-table-column prop="group" label="组" />
          <el-table-column prop="randomItem" label="随机项" />
          <el-table-column prop="probability" label="概率" />
          <el-table-column prop="creationTime" label="创建时间" />
          <el-table-column prop="modificationTime" label="修改时间" />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="isRecycleBinVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 详情模态窗口 -->
    <el-dialog v-model="isDetailsVisible" title="详情" width="70%">
      <div class="details-buttons">
        <el-button @click="editDetails" type="warning">修改</el-button>
        <el-button @click="saveDetails" type="success">保存</el-button>
        <el-button @click="deleteDetails" type="danger">删除</el-button>
      </div>
      <div class="table-container">
        <el-table :data="detailsData" class="table">
          <el-table-column prop="randomItem" label="随机项" />
          <el-table-column prop="probability" label="随机概率" />
          <el-table-column prop="creationTime" label="创建时间" />
          <el-table-column prop="modificationTime" label="修改时间" />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="isDetailsVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const isRecycleBinVisible = ref(false);
const isDetailsVisible = ref(false);
const fileInput = ref(null);
const selectedItem = ref(null);

const tableData = ref([
  { groupName: '组1', creationTime: '2024-08-10', modificationTime: '2024-08-11' },
  { groupName: '组2', creationTime: '2024-07-15', modificationTime: '2024-08-01' },
]);

const recycleBinData = ref([
  { group: '组1', randomItem: '项1', probability: '20%', creationTime: '2024-08-10', modificationTime: '2024-08-11' },
  { group: '组2', randomItem: '项2', probability: '30%', creationTime: '2024-07-15', modificationTime: '2024-08-01' },
]);

const detailsData = ref([
  { randomItem: '项1', probability: '20%', creationTime: '2024-08-10', modificationTime: '2024-08-11' },
  { randomItem: '项2', probability: '30%', creationTime: '2024-07-15', modificationTime: '2024-08-01' },
]);

const downloadTemplate = () => {
  window.location.href = 'http://127.0.0.1:8001/random/randomOption/template';
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    ElMessage.success('文件上传成功');
    // 上传文件逻辑处理
  } else {
    ElMessage.error('文件上传失败');
  }
};

const deleteGroup = () => {
  ElMessage.success('删除成功');
  // 删除逻辑处理
};

const openRecycleBin = () => {
  isRecycleBinVisible.value = true;
};

const viewDetails = (row) => {
  selectedItem.value = row;
  isDetailsVisible.value = true;
};


const deleteRecycleBinItems = () => {
  ElMessage.success('选中项已删除');
  // 删除回收站选中项逻辑处理
};

const restoreRecycleBinItems = () => {
  ElMessage.success('选中项已恢复');
  // 恢复回收站选中项逻辑处理
};

const restoreAllRecycleBinItems = () => {
  ElMessage.success('所有项已恢复');
  // 恢复所有回收站项逻辑处理
};

const deleteAllRecycleBinItems = () => {
  ElMessage.success('所有项已删除');
  // 删除所有回收站项逻辑处理
};

const editDetails = () => {
  ElMessage.info('修改功能');
  // 修改详情逻辑处理
};

const saveDetails = () => {
  ElMessage.success('保存成功');
  // 保存详情逻辑处理
};

const deleteDetails = () => {
  ElMessage.success('删除成功');
  // 删除逻辑处理
};
</script>

<style scoped>
.ctrl-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.table {
  width: 100%;
}

.table-container {
  max-height: 500px; /* Adjust as needed */
  overflow-y: auto;
}

.recycle-bin-buttons, .details-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.danger {
  color: red;
}

/* 修复模态窗口和提示框的 z-index 问题 */
.el-dialog__wrapper {
  z-index: 2000 !important;
}

.el-message-box__wrapper {
  z-index: 2001 !important;
}

.el-message {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000 !important;
}

</style>
