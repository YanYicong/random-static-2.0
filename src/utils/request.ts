import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

// 定义默认请求头
axios.defaults.headers["Content-Type"] = "application/json";

// 定义默认请求配置
const axiosInstance = axios.create({
  // baseURL: '',
  timeout: 20000,
  withCredentials: true,
});

// 获取路由实例
const router = useRouter();

/**
 * 请求拦截器  已在网关实现
 */
// axiosInstance.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     const token = localStorage.getItem('token');
//
//     // 排除登录和注册接口
//     if (config.url !== '/random/api/login'
//         && config.url !== '/random/api/register'
//         && config.url !== '/random/api/logout') {
//       if (token) {
//         if (!config.headers) {
//           config.headers = {};
//         }
//         // 将 token 添加到请求头
//         config.headers['token'] = `${token}`;
//       } else {
//         // 如果没有 token，直接提示用户登录
//         ElMessage.error('请先登录');
//         router.push('/login');
//         return Promise.reject('No token');
//       }
//     }
//     return config as InternalAxiosRequestConfig<any>; // 类型断言
//   },
//   (error: any) => {
//     return Promise.reject(error);
//   }
// );

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      ElMessage.error('未授权，请重新登录');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
