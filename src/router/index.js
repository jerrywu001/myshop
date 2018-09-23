import Vue from 'vue';
import Router from 'vue-router';
import sysHeader from '@/components/SysHeader';
import Home from '@/components/Home';
import Goods from '@/components/Goods';
import Admin from '@/components/Admin';
import Shops from '@/components/Shops';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            components: {
                header: sysHeader,
                default: Home
            },
            redirect: {
                name: 'admin'
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
		    ]
    	},
  	]
});
