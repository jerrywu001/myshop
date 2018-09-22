import Vue from 'vue';
import Router from 'vue-router';
import sysHeader from '@/components/SysHeader';
import Home from '@/components/Home';
import Sale from '@/components/Sale';
import Store from '@/components/Store';
import Admin from '@/components/Admin';

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
                    path: 'store',
                    name: 'store',
                    component: Store,
				},
                {
                    path: 'sale',
                    name: 'sale',
                    component: Sale,
				},
                {
                    path: 'admin',
                    name: 'admin',
                    component: Admin,
				}
		    ]
    	},
  	]
});
