import Vue from "vue"
import VueRouter from "vue-router";
import Login from '../views/login'
import Node from '../components/node'
import Target from '../components/target'
import AdminIndex from "../views/adminPanel"
import IPQuery from "../components/ipinfo"

Vue.use(VueRouter)

// eslint-disable-next-line no-unused-vars
const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Login,
            meta: { title: '登录界面' }
        },
        {
            path: '/admin',
            component: AdminIndex,
            meta: { title: '管理员界面' },
            children: [
                { path: 'node', component: Node, meta: { title: '节点管理' } },
                {
                    path: 'ip',
                    component: IPQuery,
                    meta: { title: 'IP 查询' },
                },
                {
                    path: 'target',
                    component: Target,
                    meta: { title: '监测 IP 管理' },
                }
            ]
        },
    ]
}
)


// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
    document.title = to.meta.title
})

export default router
