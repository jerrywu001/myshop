import Vue from 'vue';
import Router from 'vue-router';
import sysHeader from '@/components/SysHeader';
import Home from '@/components/Home';
import Detail from '@/components/Detail';
import Goods from '@/components/Goods';
import Admin from '@/components/Admin';
import Brands from '@/components/Brands';

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
                    path: 'detail',
                    name: 'detail',
                    component: Detail,
				},
                {
                    path: 'admin',
                    name: 'admin',
                    component: Admin,
                },
                {
                    path: 'brands',
                    name: 'brands',
                    component: Brands,
                },
		    ]
    	},
  	]
});
