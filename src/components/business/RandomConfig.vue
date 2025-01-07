<template>
  <div>
    <div class="ctrl-container">
      <el-button @click="addGroup" type="primary">新增</el-button>
      <el-button @click="downloadTemplate" type="success" >模板</el-button>
      <el-button @click="triggerFileInput" type="success" >导入</el-button>
      <el-button @click="openRecycleBin" type="warning" >回收站</el-button>
      <input type="file" ref="fileInput" style="display: none" accept=".xlsx" @change="handleFileUpload" />
    </div>

    <el-table :data="tableData">
      <el-table-column prop="categoryName" label="组名" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="修改时间"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editGroup(scope.row)" type="text">修改</el-button>
          <el-button @click="viewDetails(scope.row)" type="text">详情</el-button>
          <el-button @click="deleteGroup(scope.row)" type="text" class="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增组模态窗口-->
    <el-dialog v-model="isAddVisible" title="新增" width="70%" @close="()=>{addCategoryName=''}">
      <div class="newCategory">
        <el-input v-model="addCategoryName" placeholder="组名" maxlength="24" show-word-limit></el-input>
      </div>
      <el-button type="success" @click="addRandomCategory">确定</el-button>
    </el-dialog>

    <!--新增项模态窗口-->
    <el-dialog v-model="isAddOptionVisible" title="新增项" width="70%" @close="saveInputAvailable=false" @open="addOption.probabilityProportion='';saveInputAvailable=false">
      <div class="newCategory">
        <el-input v-model="addOption.optionName" placeholder="项名" maxlength="24" show-word-limit></el-input>
        <el-input v-model="addOption.probabilityProportion" placeholder="概率" @input="validateInput" maxlength="3"></el-input>
      </div>
      <el-button type="success" @click="addRandomOption" :disabled="saveInputAvailable">确定</el-button>
    </el-dialog>

    <!--修改模态窗口-->
    <el-dialog v-model="isUpdateBinVisible" title="修改" width="70%"  @close="resetEditingState">
      <div class="details-container">
        <el-input v-model="updateCategory.categoryName" class="details-input" maxlength="24" show-word-limit></el-input>
        <el-button class="details-add" type="success" @click="addGroupOption">新增</el-button>
      </div>
      <div class="table-container">
        <el-table :data="updateData" class="table">
          <el-table-column prop="optionName" label="随机项">
            <template #default="scope">
              <div v-if="!scope.row.isEditing">
                {{ scope.row.optionName }}
              </div>
              <div v-else>
                <el-input v-model="scope.row.optionName" maxlength="24" show-word-limit/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="probabilityProportion" label="概率">
            <template #default="scope">
              <div v-if="!scope.row.isEditing">
                {{ scope.row.probabilityProportion !== null && scope.row.probabilityProportion !== undefined && scope.row.probabilityProportion !== '' ? scope.row.probabilityProportion + '%' : '' }}
              </div>
              <div v-else>
                <el-input v-model="scope.row.probabilityProportion" maxlength="3"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <div v-if="!scope.row.isEditing">
                <el-button @click="editDetails(scope.row)" type="text">修改</el-button>
                <el-button @click="delDetails(scope.row)" type="text" class="danger">删除</el-button>
              </div>
              <div v-else>
                <el-button @click="saveDetails(scope.row)" type="text">保存</el-button>
                <el-button @click="cancelEdit(scope.row)" type="text">取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="saveRandomCategory">确定</el-button>
      </template>
    </el-dialog>

    <!-- 回收站模态窗口 -->
    <el-dialog v-model="isRecycleBinVisible" title="回收站" width="70%">
      <div class="recycle-bin-buttons">
        <el-button @click="restoreAllRecycleBinItems" type="success">全部恢复</el-button>
        <el-button @click="deleteAllRecycleBinItems" type="danger">全部删除</el-button>
      </div>
      <div class="table-container">
        <el-table :data="recycleBinData" class="table" row-key="id"
         :tree-props="{ hasChildren: 'true', children: 'option' }">
          <el-table-column prop="categoryName" label="组" width="200px" />
          <el-table-column prop="optionName" label="随机项" width="150px" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="updateTime" label="修改时间" />
          <el-table-column label="操作">
              <template #default="scope" >
                <div v-if="scope.row.isControl">
                  <el-button @click="restoreGroupAndOption(scope.row)" type="text" >恢复</el-button>
                  <el-button @click="killGroupOrOption(scope.row)" type="text" class="danger">删除</el-button>
                </div>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="isRecycleBinVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 详情模态窗口 -->
    <el-dialog v-model="isDetailsVisible" title="详情" width="70%">
      <div class="table-container">
        <el-table :data="detailsData" class="table">
          <el-table-column prop="optionName" label="随机项" />
          <el-table-column prop="probabilityProportion" label="随机概率">
            <template #default="scope">
              {{ scope.row.probabilityProportion !== null && scope.row.probabilityProportion !== undefined ? scope.row.probabilityProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="updateTime" label="修改时间" />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="isDetailsVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {
  changeRandomCategory,
  changeRandomOption,
  configUpload,
  getUploadTemplate, removeAll, removeRandomCategory, removeRandomOption,
  restoreAllDeleted
} from "~/api/config";
import {getCategoriesAndOptions} from "~/api/start";
import {ElMessage} from "element-plus";
import {startLoading, stopLoading} from "~/utils/utils";

// 修改模态窗口状态
const isUpdateBinVisible = ref(false);
// 回收站模态窗口状态
const isRecycleBinVisible = ref(false);
// 详情模态窗口状态
const isDetailsVisible = ref(false);
// 文件上传
const fileInput = ref(null);
// 配置表数据
const tableData = ref([]);
//回收站内容
const recycleBinData = ref([]);
// 修改数据
const updateData = ref({});
// 修改组
const updateCategory = ref({});
// 详情数据
const detailsData = ref([]);
// 新增组对话框
const isAddVisible = ref(false);
// 新增组名
const addCategoryName = ref('');
// 新增项对话框
const isAddOptionVisible = ref(false);
// 新增项数据
const addOption = ref({});
//新增项是否可以点击保存（概率）
const saveInputAvailable = ref(false);


/**
 * 查询配置内容
 * @returns {Promise<void>}
 */
const getConfigData = async () => {
  startLoading();
  const params = {
    isApply : 0,
  };
  try {
    const {data} = (await getCategoriesAndOptions(params));
    if(data.code != 200){
      ElMessage.error(data.msg);
    }
    tableData.value = data.data;
    }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

/**
 * 修改组名
 * @returns {Promise<void>}
 */
const saveRandomCategory = async() => {
  startLoading();
  const param = {
    id : updateCategory.value.id,
    categoryName : updateCategory.value.categoryName,
  };
  try {
    const {data} = (await changeRandomCategory(param));
    if (data.code == 200) {
      ElMessage.success("保存成功");
    }else {
      ElMessage.error(data.msg);
    }
    isUpdateBinVisible.value = false;
    await getConfigData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

/**
 * 下载导入模板
 */
const downloadTemplate = () => {
  startLoading();
  getUploadTemplate().then((response) => {
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'configTemplate.xlsx'; // 设置下载的文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl); // 释放内存
    ElMessage.success('下载成功')
    stopLoading();
  }).catch(error => {
    ElMessage.error('下载模板失败');
    stopLoading();
  });
};

// 导入,触发文件选择
const triggerFileInput = () => {
  startLoading();
  if (fileInput.value) {
    fileInput.value.click();
  }
  stopLoading();
};

/**
 * 导入配置
 * @param event
 */
const handleFileUpload = (event) => {
  startLoading();
  const file = event.target.files[0];
  if (file) {
    configUpload(file)
      .then(() => {
        ElMessage.success('文件上传成功');
        getConfigData();
      })
      .catch((error) => {
        ElMessage.error('文件上传失败');
      });
  } else {
    ElMessage.error('请选择一个文件');
    stopLoading();
  }
  stopLoading();
};

/**
 * 逻辑删除组
 * @param row
 */
const deleteGroup = async (row) => {
  startLoading();
  const param = {
    id : row.id,
    isApply : 1,
  }
  try {
    const {data} = (await changeRandomCategory(param));
    if (data.code == 200) {
      ElMessage.success("删除成功");
    }else {
      ElMessage.error(data.msg);
    }
    await getConfigData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
};

/**
 * 保存编辑状态
 * @param row
 * @returns {Promise<void>}
 */
const saveDetails = async (row) => {
  startLoading();
  const regex = /^$|^[1-9]([0-9]?)?$/;
  const param = {
    id : row.id,
    optionName : row.optionName,
    probabilityProportion : row.probabilityProportion,
  }
  try {
    if(!regex.test(row.probabilityProportion) && row.probabilityProportion != null) {
      ElMessage.error("请输入正确概率！(0-100整数)");
      return;
    }else {
      const {data} = await changeRandomOption(param);
      if(data.code != 200) {
        ElMessage.error(data.msg);
      }else {
        row.isEditing = false;
      }
    }
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
};

/**
 * 获取已删除内容
 * @returns {Promise<void>}
 */
const getDeleteData = async () => {
  startLoading();
  const param = {
    isApply : 1,
  }
  try {
    const {data} = await getCategoriesAndOptions(param);
    if(data.code == 200) {
    recycleBinData.value = data.data;
    // 判断是否要有恢复和删除按钮
    recycleBinData.value.forEach(item => {
      //组
      if (item.isApply == 1) {
        item.isControl = true;
        // 项
        item.option.forEach(option => {
        if(option.isApply == 1) {
          option.isControl = false;
        }else {
          option.isControl = true;
        }
      })
      } else {
        item.isControl = false;
        // 项
        item.option.forEach(option => {
        if(option.isApply == 1) {
          option.isControl = true;
        }else {
          option.isControl = false;
        }
      })
      }
    })
  }else {
      ElMessage.error(data.msg);
    }
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}


/**
 * 新增组
 * @returns {Promise<void>}
 */
const addRandomCategory = async () => {
  startLoading();
  const param = {
    categoryName : addCategoryName.value,
  }
  try {
    const {data} = await changeRandomCategory(param);
    if(data.code != 200) {
      ElMessage.error(data.msg);
    }
    isAddVisible.value = false;
    addCategoryName.value = '';
    await getConfigData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

/**
 * 新增项
 * @returns {Promise<void>}
 */
const addRandomOption = async () => {
  startLoading();
  const param ={
    optionName : addOption.value.optionName,
    probabilityProportion : addOption.value.probabilityProportion,
    inCategory : updateCategory.value.id,
  }
  try {
    const {data} = await changeRandomOption(param);
    if(data.code != 200) {
      ElMessage.error(data.msg);
    }
    isAddOptionVisible.value = false;
    addOption.value = {};
    await getConfigData();
    // 根据当前组id从刷新后的表数据中取出新的组用于当前模态窗口数据更新
    const temp = tableData.value.find(item => item.id == updateCategory.value.id);
    updateData.value = temp.option;
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

/**
 * 单记录恢复
 * @param row
 * @returns {Promise<void>}
 */
const restoreGroupAndOption = async(row) => {
  startLoading();
  const param = {
    id : row.id,
    isApply : 0,
  }
  try {
    if (row.categoryName != undefined) {
      await changeRandomCategory(param);
    }else {
      await changeRandomOption(param);
    }
    await getConfigData();
    await getDeleteData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

/**
 * 单记录永久删除
 * @param row
 * @returns {Promise<void>}
 */
const killGroupOrOption = async(row) => {
  startLoading();
  const id = row.id;
  try {
    if(row.categoryName != undefined) {
      await removeRandomCategory(id);
    }else {
      await removeRandomOption(id);
    }
    await getConfigData();
    await getDeleteData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

//新增组对话框
const addGroupOption = () =>{
  isAddOptionVisible.value = true;
}

//新增组窗口
const addGroup = () => {
  isAddVisible.value = true;
}

// 回收站打开
const openRecycleBin = () => {
  getDeleteData();
  isRecycleBinVisible.value = true;
};


// 修改窗口
const editGroup = (row) => {
  updateData.value = row.option;
  // 保留当前组数据
  updateCategory.value.categoryName = row.categoryName;
  updateCategory.value.id = row.id;
  isUpdateBinVisible.value = true;
}

// 显示详情窗口
const viewDetails = (row) => {
  detailsData.value = row.option;
  isDetailsVisible.value = true;
};

// 进入编辑状态
const editDetails = (row) => {
  // 保存当前数据的快照
  row.originalData = {
    optionName: row.optionName,
    probabilityProportion: row.probabilityProportion
  };
  row.isEditing = true;
};

// 取消编辑状态
const cancelEdit = (row) => {
  // 还原为编辑前的数据
  row.optionName = row.originalData.optionName;
  row.probabilityProportion = row.originalData.probabilityProportion;
  row.isEditing = false;
};

// 修改窗口关闭时重置编辑状态
const resetEditingState = () => {
  updateData.value.forEach(row => {
    row.isEditing = false; // 重置所有行的编辑状态
  });
};

// 判断是否显示按钮
const shouldShowButton = (row) => {
  // 检查当前行的 isApply 属性
  if (row.isApply === 1) return true;

  // 如果当前行有子项，递归检查子项的 isApply 属性
  if (row.option && row.option.length > 0) {
    return row.option.some(shouldShowButton);
  }

  return false;
};

/**
 * 恢复所有
 */
const restoreAllRecycleBinItems = async() => {
  startLoading();
  try {
    const {data} = await restoreAllDeleted();
    if(data.code == 200) {
      ElMessage.success("恢复成功");
    }else {
      ElMessage.error("恢复失败");
    }
    await getConfigData();
    await getDeleteData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
};

/**
 * 删除所有
 */
const deleteAllRecycleBinItems = async() => {
  startLoading();
  try {
    const {data} = await removeAll();
    if(data.code == 200) {
      ElMessage.success("删除成功");
    }else {
      ElMessage.error("删除失败");
    }
    await getConfigData();
    await getDeleteData();
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
};


/**
 * 删除随机项
 * @param row
 * @returns {Promise<void>}
 */
const delDetails = async(row) => {
  startLoading();
  const param = {
    id : row.id,
    isApply : 1,
  }
  try {
    const {data} = await changeRandomOption(param);
    if(data.code != 200) {
      ElMessage.success('删除失败');
    }
    //  模态窗口内刷新
    // 表数据刷新
    await getConfigData();
    // 根据当前组id从刷新后的表数据中取出新的组用于当前模态窗口数据更新
    const temp = tableData.value.find(item => item.id == updateCategory.value.id);
    updateData.value = temp.option;
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
}

// 概率限制
const validateInput = (val) => {

  const regex = /^$|^[1-9]([0-9]?)?$/;

  if (!regex.test(val)) {
    saveInputAvailable.value = true;
    ElMessage.error('请输入正确的概率!(0-100整数)');
  }else {
    saveInputAvailable.value = false;
  }
};

/**
 * 默认数据获取
 */
onMounted(() => {
  startLoading();
  try {
    getConfigData()
  }catch (error) {
    ElMessage.error("崩溃啦  ㄟ( ▔, ▔ )ㄏ");
  }finally {
    stopLoading();
  }
});
</script>

<style scoped>
.ctrl-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}


.table-container {
  max-height: 300px;
  //max-width: 800px;
  overflow-y: auto;
}

.recycle-bin-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}
.details-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}
.details-input{
  width: 300px;
}
.details-add{
  display: flex;
  margin-right: 30px;
}
.danger {
  color: red;
}
.newCategory{
  width: 40%;
  margin-left: 300px;
  padding-bottom: 60px;
  padding-top: 60px;
  display: flex;
  gap: 10px;
}


</style>
