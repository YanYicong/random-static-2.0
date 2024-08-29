import { service } from "~/utils/request"
import {RANDOM_CONFIG} from "~/utils/globle";

/**
 * 随机项组（新增/修改/逻辑删除/恢复）  无id为新增，有id无categoryName为删除/恢复，有id有categoryName为修改
 */
export const changeRandomCategory = (param : any) => {
    return service({
        url: `${RANDOM_CONFIG}/randomCategory`,
        method: 'POST',
        data: param,
    })
}

/**
 * 随机项（新增/修改/逻辑删除/恢复） 无id为新增，有id为其他，直接视为修改然后传值即可
 * @param param
 */
export const changeRandomOption = (param : any) => {
    return service({
        url: `${RANDOM_CONFIG}/randomOption`,
        method: 'POST',
        data: param,
    })
}

/**
 * 物理删除随机项组
 * @param id
 */
export const removeRandomCategory = (id : string) =>{
    return service({
        url: `${RANDOM_CONFIG}/delRandomCategory/${id}`,
        method: 'DELETE',
        data: id,
    })
}

/**
 * 物理删除随机项
 * @param id
 */
export const removeRandomOption = (id : string) => {
    return service({
        url: `${RANDOM_CONFIG}/delRandomOption/${id}`,
        method: 'DELETE',
        data: id,
    })
}

/**
 * 恢复全部已删除
 */
export const restoreAllDeleted = () => {
    return service({
        url: `${RANDOM_CONFIG}/restoreAll`,
        method: 'POST',
    })
}

/**
 * 物理删除所有逻辑删除
 */
export const removeAll = () => {
    return service({
        url: `${RANDOM_CONFIG}/killAll`,
        method: 'DELETE',
    })
}

/**
 * 获取导入模板
 */
export const getUploadTemplate = () => {
    return service({
        url: `${RANDOM_CONFIG}/template`,
        method: 'GET',
        responseType: 'blob',
        // headers: {
        //     'Content-Type': 'application/octet-stream',
        //     'Connection' : 'keep-alive',
        //
        // },
    })
};

/**
 * 配置导入
 * @param file
 */
export const configUpload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return service({
    url: `${RANDOM_CONFIG}/upload`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
