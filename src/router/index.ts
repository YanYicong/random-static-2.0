import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

import Index from "~/components/business/Index.vue";
import RandomStater from "~/components/business/RandomStater.vue";
import RandomHistory from "~/components/business/RandomHistory.vue";
import RandomConfig from "~/components/business/RandomConfig.vue";
import Login from "~/components/Login.vue";
import Home from "~/components/business/Home.vue";
import Register from "~/components/Register.vue";
import LoginInput from "~/components/LoginInput.vue";
import Forget from "~/components/Forget.vue";

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path: '/',
            redirect: '/randomPage/login', // 重定向到你希望的页面
        },
        {
            path: '/randomPage',
            component: Login,
            children:
            [
                {
                    path: '/randomPage/register',
                    component:Register,
                },
                {
                    path:'/randomPage/login',
                    component:LoginInput,
                },
                {
                    path: '/randomPage/forget',
                    component:Forget,
                }
            ]
        },
        {
            path:'/randomPage/home',
            component:Home,
            children :
            [
                {
                    path: '/randomPage/home/index',
                    component: Index,
                },
                {
                    path:'/randomPage/home/randomStater',
                    component:RandomStater,
                },
                {
                    path:'/randomPage/home/randomHistory',
                    component:RandomHistory,
                },
                {
                    path:'/randomPage/home/randomConfig',
                    component:RandomConfig,
                }
            ]
        }
    ]
})

export default router
