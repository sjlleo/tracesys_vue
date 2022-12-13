import Vue from "vue"
import VueRouter from "vue-router";
import Login from '../views/login'
import Node from '../components/admin/node'
import Target from '../components/admin/target'
import AdminIndex from "../views/adminPanel"
import UserMainPage from "../components/user/index"
import AdminMainPage from "../components/admin/index"
import IPQuery from "../components/admin/ipinfo"
import Chart from "../components/admin/chartInfo"
import User from "../components/admin/user"
import Password from "../components/user/changePassword"
import Task from "../components/admin/task"
import UserIndex from "../views/userPanel"
import ipReviewUser from "../components/user/ipReview"
import ipReviewAdmin from "../components/admin/ipReview"

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
            meta: {title: '用户界面', isAuth: true},
            children: [
                {
                    path: 'dashboard',
                    component: UserMainPage,
                    meta: { title: '用户仪表盘', isAuth: true },
                },
                { path: 'node', component: Node, meta: { title: '节点管理' } },
                {
                    path: 'ip',
                    component: IPQuery,
                    meta: { title: 'IP 查询', isAuth: true},
                },
                {
                    path: 'target',
                    component: Target,
                    meta: { title: '监测 IP 管理', isAuth: true },
                },
                {
                    name: 'updateUserPassword',
                    path: 'password',
                    component: Password,
                    meta: { title: '修改密码', isAuth: true },
                },
                {
                    name: 'task',
                    path: 'task',
                    component: Task,
                    meta: { title: '任务详情', isAuth: true },
                },
                {
                    name: 'ipReview',
                    path: 'ipReview',
                    component: ipReviewUser,
                    meta: { title: 'IP 审计', isAuth: true },
                },
            ]
        },
        {
            path: '/admin',
            component: AdminIndex,
            meta: { title: '管理员界面', isAuth: true },
            children: [
                {
                    path: 'dashboard',
                    component: AdminMainPage,
                    meta: { title: '管理员仪表盘', isAuth: true },
                },
                {
                    path: 'users',
                    component: User,
                    meta: { title: '用户管理', isAuth: true },
                },
                { path: 'node', component: Node, meta: { title: '节点管理', isAuth: true } },
                {
                    path: 'ip',
                    component: IPQuery,
                    meta: { title: 'IP 查询', isAuth: true },
                },
                {
                    path: 'target',
                    component: Target,
                    meta: { title: '监测 IP 管理', isAuth: true },
                },
                {
                    name: 'updatePassword',
                    path: 'password',
                    component: Password,
                    meta: { title: '修改密码', isAuth: true },
                },
                {
                    name: 'task',
                    path: 'task',
                    component: Task,
                    meta: { title: '任务详情', isAuth: true },
                },
                {
                    name: 'ipReview',
                    path: 'ipReview',
                    component: ipReviewAdmin,
                    meta: { title: 'IP 审计', isAuth: true },
                },
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
router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {
        console.log(localStorage.getItem('user'))
        if (localStorage.getItem('user') != null) {
            let obj = JSON.parse(localStorage.getItem('user'))
            // 判断是不是用户权限
            if (obj.role == 2 && to.path.indexOf("user") == -1) {
                return
            }
            next()
        }
    } else {
        next()
    }
})

router.afterEach((to, from) => {
    document.title = to.meta.title
})

export default router
