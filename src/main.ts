import { createApp } from "vue";
import App from "./App.vue";
import "~/styles/index.scss";
import "uno.css";
import router from "./router";


import "element-plus/theme-chalk/src/message.scss";
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import ElementPlus,{ElLoading} from 'element-plus';
import 'element-plus/dist/index.css';


const app = createApp(App);
// app.use(ElementPlus);
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.config.globalProperties.$loading = ElLoading.service;
app.mount("#app");
