// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import config from './config';
//
// // 判断是路由跳转还是 axios 请求
// // if (process.server) {
// //   config.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
// // }
//
// const service: AxiosInstance = axios.create(config);
//
// // 定义返回结果的接口
// interface ResponseData<T = any> {
//   data: T;
//   status: number;
//   statusText: string;
// }
//
// // 返回结果处理
// service.interceptors.response.use(
//   (res: AxiosResponse): AxiosResponse => {
//     return res;  // 直接返回 AxiosResponse 对象
//   },
//   (error) => Promise.reject(error),
// );
//
// export default {
//   // post 方法
//   post<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
//     return service.post(url, data).then((res) => ({
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     }));
//   },
//   // put 方法
//   put<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
//     return service.put(url, data).then((res) => ({
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     }));
//   },
//   // get 方法
//   get<T = any>(url: string, params?: any): Promise<ResponseData<T>> {
//     return service.get(url, { params }).then((res) => ({
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     }));
//   },
//   // delete 方法
//   delete<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
//     return service.delete(url, { data }).then((res) => ({
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     }));
//   },
// };
