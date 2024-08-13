import {createRouter, createWebHistory} from 'vue-router'

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
    history:createWebHistory(),
    routes:[
        {
            path: '/',
            redirect: '/random/login', // 重定向到你希望的页面
        },
        {
            path: '/random',
            component: Login,
            children:
            [
                {
                    path: '/random/register',
                    component:Register,
                },
                {
                    path:'/random/login',
                    component:LoginInput,
                },
                {
                    path: '/random/forget',
                    component:Forget,
                }
            ]
        },
        {
            path:'/random/home',
            component:Home,
            children :
            [
                {
                    path: '/random/home/index',
                    component: Index,
                },
                {
                    path:'/random/home/randomStater',
                    component:RandomStater,
                },
                {
                    path:'/random/home/randomHistory',
                    component:RandomHistory,
                },
                {
                    path:'/random/home/randomConfig',
                    component:RandomConfig,
                }
            ]
        }
    ]
})

export default router
