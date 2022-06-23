import { createRouter, createWebHistory, START_LOCATION } from 'vue-router';
import useAuth from '../stores/auth';

import Home from '../pages/Home.vue';
import Landing from '../pages/Landing.vue';
import Template from '../pages/Template.vue';

import AlbumMain from '../pages/AlbumMain.vue';
import PictureMain from '../pages/PictureMain.vue';
import PictureNew from '../pages/PictureNew.vue';

const routes = [
    { path: '/', component: Landing },
    {
        path: '/',
        component: Template,
        children: [
            { path: '/home', component: Home },
            { path: '/albums', component: AlbumMain },
            { path: '/pictures', component: PictureMain },
            {
                path: '/pictures/new',
                component: PictureNew,
                meta: { auth: true },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuth();
    const guard = () => {
        if (to.meta.auth && !auth.check) {
            return next({ path: '/login' });
        }
        if (to.meta.guest && auth.check) {
            return next({ path: '/home' });
        }

        next(true);
    };

    if (from === START_LOCATION) {
        auth.load().then(guard);
    } else {
        guard();
    }
});

export default router;
