import Vue from 'vue';
import Router from 'vue-router';
import sysHeader from '@/components/SysHeader.vue';
import Home from '@/components/Home.vue';
import Goods from '@/components/Goods.vue';
import Admin from '@/components/Admin.vue';
import Shops from '@/components/Shops.vue';
import Sales from '@/components/Sales.vue';

Vue.use(Router);

export default new Router({
    base: process.env.BASE_URL,
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            components: {
                header: sysHeader,
                default: Home,
            },
            redirect: {
                name: 'admin',
            },
            children: [
                {
                    path: 'goods',
                    name: 'goods',
                    component: Goods,
                },
                {
                    path: 'good/:id',
                    name: 'detail',
                    component: Admin,
                },
                {
                    path: 'admin',
                    name: 'admin',
                    component: Admin,
                },
                {
                    path: 'shops',
                    name: 'shops',
                    component: Shops,
                },
                {
                    path: 'sales',
                    name: 'sales',
                    component: Sales,
                },
            ],
        },
    ],
});
