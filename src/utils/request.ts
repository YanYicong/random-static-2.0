import axios from "axios";

// 定义默认请求头
axios.defaults.headers["Content-Type"] = "application/json";

// 定义默认请求配置
export const service = axios.create({
  // baseURL:
  timeout: 10000,
  withCredentials: true,
});
