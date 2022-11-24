import Vue from "vue"
import VueRouter from "vue-router";
import Login from '../views/login'
import Node from '../components/admin/node'
import Target from '../components/admin/target'
import AdminIndex from "../views/adminPanel"
import IPQuery from "../components/admin/ipinfo"
import Chart from "../components/admin/chartInfo"
import User from "../components/admin/user"
import Password from "../components/user/changePassword"
import UserIndex from "../views/userPanel"

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
            path: '/user',
            component: UserIndex,
            meta: {title: '用户界面'},
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
                },
                {
                    name: 'updateUserPassword',
                    path: 'password',
                    component: Password,
                    meta: { title: '修改密码' },
                }
            ]
        },
        {
            path: '/admin',
            component: AdminIndex,
            meta: { title: '管理员界面' },
            children: [
                {
                    path: 'users',
                    component: User,
                    meta: { title: '用户管理' },
                },
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
                },
                {
                    name: 'updatePassword',
                    path: 'password',
                    component: Password,
                    meta: { title: '修改密码' },
                }
            ]
        },
        {
            name: 'chartInfo',
            path: '/chart/:method/:nodeID/:targetIP',
            component: Chart,
            meta: { title: '图表' },
        },
    ]
}
)


// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
    document.title = to.meta.title
})

export default router
