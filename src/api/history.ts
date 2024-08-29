import {RANDOM_HISTORY} from "~/utils/globle";
import {service} from "~/utils/request";

export const getRandomHistory = (params : any) => {
    return service({
        url: `${RANDOM_HISTORY}/historyPage`,
        method: 'POST',
        data: params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    })
};

/**
 * 获取历史记录详情
 * @param historyId
 */
export const getRandomHistoryOption = (historyId : string) => {
    return service({
        url: `${RANDOM_HISTORY}/historyOption/${historyId}`,
        method: 'GET',
        data: historyId,
    })
};

/**
 * 批量删除历史记录
 * @param ids
 */
export const delHistory = (ids : string[]) => {
    return service({
        url: `${RANDOM_HISTORY}/historyClean`,
        method: 'DELETE',
        data: ids,
    })
};

/**
 * 清空历史记录
 */
export const delAllHistory = () => {
    return service({
        url: `${RANDOM_HISTORY}/historyCleanAll`,
        method: 'DELETE',
    })
};

/**
 * 导出历史记录
 */
export const getHistoryExport = (param:any) => {
    return service({
        url: `${RANDOM_HISTORY}/report`,
        method: 'GET',
        responseType: 'blob',
        params: param,
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'history.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch((error) => {
        console.error("下载失败", error);
    });
};
