<template>
  <el-container>
    <el-header class="top-heade">
      <el-input v-model="search.randomCategory" placeholder="组名" class="input-box"></el-input>
      <el-date-picker v-model="search.startTime" type="datetime" placeholder="起始时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="input-box"></el-date-picker>
      <el-date-picker v-model="search.endTime" type="datetime" placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="input-box"></el-date-picker>
      <el-button type="primary" @click="getHistoryPageData" class="button-box">搜索</el-button>
      <el-button type="success" @click="historyDownload" class="button-box">导出</el-button>
      <el-button type="danger" @click="historyDelete" class="button-box">删除</el-button>
      <el-button type="warning" @click="historyClearAll" class="button-box">清除全部</el-button>
    </el-header>

    <el-main>
      <el-table :data="pageData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="randomCategory" label="随机组"></el-table-column>
        <el-table-column prop="runResult" label="执行结果"></el-table-column>
        <el-table-column prop="runTime" label="执行时间"></el-table-column>
        <el-table-column  label="操作">
          <template #default="scope">
            <el-button @click="viewDetails(scope.row)" type="text">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="page.size"
          :current-page="page.pageNum"
          :page-size="page.pageSize"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-main>

    <el-dialog title="详情" v-model="modalVisible">
      <el-table :data="optionData" style="width: 100%">
        <el-table-column prop="optionName" label="随机项"></el-table-column>
        <el-table-column prop="probability" label="概率">
           <template #default="scope">
              {{ scope.row.probability !== null && scope.row.probability !== undefined ? scope.row.probability + '%' : '' }}
           </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {delAllHistory, delHistory, getHistoryExport, getRandomHistory, getRandomHistoryOption} from "~/api/history";
import {ElLoading, ElMessage} from "element-plus";
import {startLoading, stopLoading} from "~/utils/utils";


// 输入框查询条件
const search = reactive({
  randomCategory: "",
  startTime: "",
  endTime: "",
});

// 分页参数
const page = reactive({
  pageSize: 8,
  pageNum: 1,
  size: 0,
});

// 详情数据
const optionData = ref([]);
// 模态窗口开关
const modalVisible = ref(false);
// 分页数据
const pageData = ref([]);
// 选中内容
const selectedIds = ref<string[]>([]);

/**
 * 分页查询历史记录
 */
const getHistoryPageData = async () => {
  startLoading();
  const params = {
    randomCategory: search.randomCategory,
    startTime: search.startTime,
    endTime: search.endTime,
    pageNum: page.pageNum,
    pageSize: page.pageSize,
  };
  try {
    const { data } = (await getRandomHistory(params)) as any;
    if (data.code != 200) {
      ElMessage.error(data.msg);
    } else {
      page.size = data.total;
      pageData.value = data.rows;
    }
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
};

// 默认数据加载
onMounted(() => {
  startLoading();
  try {
    getHistoryPageData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
});

/**
 * 导出
 */
const historyDownload = async () => {
  startLoading();
  const param = {
    randomCategory: search.randomCategory,
    startTime: search.startTime,
    endTime: search.endTime,
  }
  try {
    await getHistoryExport(param);
  }catch (error) {
    ElMessage.error("导出异常");
  }finally {
    stopLoading();
  }
};

// 处理表格选择变化
const handleSelectionChange = (selectRows: any[]) => {
  selectedIds.value = selectRows.map((row) => row.id);
};

/**
 * 批量删除
 */
const historyDelete = async () => {

  const params = selectedIds.value;
  if (params.length == 0) {
    ElMessage.error("请先选择要删除的记录");
    return;
  }
  startLoading();
  try {
    const { data } = (await delHistory(params)) as any;
    if (data.code != 200) {
      ElMessage.error(data.msg);
    } else {
      await getHistoryPageData();
    }
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
};

/**
 * 查看详情
 */
const viewDetails = async (row) => {
  startLoading();
  const historyId = row.id;
  try {
    const {data} = (await getRandomHistoryOption(historyId));
    if (data.code != 200) {
      ElMessage.error(data.msg);
    }else {
      optionData.value = data.data;
      modalVisible.value = true;
    }
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

/**
 * 清空历史记录
 */
const historyClearAll = async () => {
  startLoading();
  try {
    const { data } = (await delAllHistory()) as any;
    if (data.code != 200) {
      ElMessage.error(data.msg);
    } else {
      ElMessage.success("删除成功");
      await getHistoryPageData();
    }
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
};

// 处理分页变化
const handlePageChange = (newPageNum: number) => {
  page.pageNum = newPageNum;
  getHistoryPageData();
};

// 处理每页显示数量变化
const handleSizeChange = (newPageSize: number) => {
  page.pageSize = newPageSize;
  getHistoryPageData();
};


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
  margin-right: 10px;
  width: 200px;
  height: 33px;
}

.button-box {
  //margin-right: 10px;
  //width: 100px;
  //margin-left: 20px;
}

.el-main {
  padding: 20px;
}

.pagination-box {
  margin-top: 20px;
  display: flex;
  justify-content: center; /* 居中分页 */
  align-items: center;
}

.el-table th,
.el-table td {
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

.top-heade{
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
