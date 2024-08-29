
import { ElLoading } from 'element-plus'

let loadingInstance: ReturnType<typeof ElLoading.service> | null = null;

/**
 * 开始loading
 */
export const startLoading = () => {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '等会啊...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
  }
}
/**
 * 结束loading
 */
export const stopLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
}
