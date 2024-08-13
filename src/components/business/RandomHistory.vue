<template>
  <el-container>
    <el-header>
      <el-input v-model="search.groupName" placeholder="组名" class="input-box"></el-input>
      <el-date-picker v-model="search.startDate" type="datetime" placeholder="起始时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="input-box"></el-date-picker>
      <el-date-picker v-model="search.endDate" type="datetime" placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="input-box"></el-date-picker>
      <el-button type="primary"  @click="handleSearch" class="button-box">搜索</el-button>
      <el-button type="success"  @click="handleExport" class="button-box">导出</el-button>
      <el-button type="danger"  @click="handleDelete" class="button-box">删除</el-button>
      <el-button type="warning" @click="handleClearAll" class="button-box">清除全部</el-button>
    </el-header>

    <el-main>
      <el-table :data="pagedData" style="width: 100%" highlight-current-row @row-dblclick="handleRowDblClick" @row-click="handleRowClick">
        <el-table-column prop="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="groupName" label="随机组"></el-table-column>
        <el-table-column prop="result" label="执行结果"></el-table-column>
        <el-table-column prop="time" label="执行时间"></el-table-column>
      </el-table>

      <el-pagination
        @current-change="handlePageChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        layout="prev, pager, next"
        :total="totalRecords"
        class="pagination-box"
      ></el-pagination>
    </el-main>

    <el-dialog title="随机详情" :visible.sync="modalVisible">
      <el-table :data="modalData" style="width: 100%">
        <el-table-column prop="optionName" label="随机项"></el-table-column>
        <el-table-column prop="probability" label="概率"></el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const search = reactive({
  groupName: '',
  startDate: '',
  endDate: '',
});

const totalRecords = ref(0);
const allData = ref([]);
const pagedData = ref([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
});

const modalVisible = ref(false);
const modalData = ref([]);

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8001/random/randomHistory/historyPage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        randomCategory: search.groupName,
        startTime: search.startDate,
        endTime: search.endDate,
        pageNum: 1,
        pageSize: 10000,
      }),
    });
    const data = await response.json();
    if (data.code === 200) {
      totalRecords.value = data.total;
      allData.value = data.rows;
      updateTableData();
    } else {
      ElMessage.error(data.msg);
    }
  } catch (error) {
    ElMessage.error('获取数据失败');
  }
};

const handleSearch = () => {
  pagination.currentPage = 1;
  fetchData();
};

const updateTableData = () => {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  pagedData.value = allData.value.slice(start, start + pagination.pageSize);
};

const handlePageChange = (newPage) => {
  pagination.currentPage = newPage;
  updateTableData();
};

const handleExport = async () => {
  try {
    const response = await fetch('http://localhost:8001/random/randomHistory/report', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    ElMessage.success('导出成功！');
  } catch (error) {
    ElMessage.error('导出失败！');
  }
};

const handleDelete = async () => {
  const selectedRows = pagedData.value.filter(row => row.selected);
  if (selectedRows.length === 0) {
    ElMessage.warning('请通过单击选择要删除的记录');
    return;
  }

  const idsToDelete = selectedRows.map(row => row.id);
  try {
    await fetch('http://localhost:8001/random/randomHistory/historyClean', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idsToDelete),
    });
    ElMessage.success('删除成功！');
    fetchData();
  } catch (error) {
    ElMessage.error('删除失败！');
  }
};

const handleClearAll = async () => {
  const confirmed = confirm('确定清除所有历史记录吗？');
  if (confirmed) {
    try {
      await fetch('http://localhost:8001/random/randomHistory/historyCleanAll', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      ElMessage.success('清除成功！');
      fetchData();
    } catch (error) {
      ElMessage.error('清除失败！');
    }
  }
};

const handleRowClick = (row) => {
  row.selected = !row.selected;
};

const handleRowDblClick = async (row) => {
  try {
    const response = await fetch(`http://localhost:8001/random/randomHistory/historyOption/${row.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    modalData.value = data.data.map(item => ({
      optionName: item.optionName,
      probability: item.probability ? `${item.probability}%` : '默认',
    }));
    modalVisible.value = true;
  } catch (error) {
    ElMessage.error('获取详情失败');
  }
};

fetchData();
</script>

<style scoped>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.input-box {
  margin-right: 15px;
  width: 200px;
}

.button-box {
  margin-right: 10px;
  margin-left: 20px;
}

.el-main {
  padding: 20px;
}

.pagination-box {
  margin-top: 20px;
  text-align: center;
}

.el-table th, .el-table td {
  text-align: center;
}

.el-table .el-table__body-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.el-dialog {
  width: 600px;
}

.el-dialog .el-dialog__header {
  background-color: #007bff;
  color: white;
}

.el-dialog .el-dialog__body {
  max-height: 300px;
  overflow-y: auto;
}
</style>
