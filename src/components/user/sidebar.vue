<template>
    <el-aside style="background-color: rgb(238, 241, 246)" width="200px">
        <el-menu router>
            <el-menu-item index="/user/dashboard"><i class="el-icon-odometer"></i>仪表盘</el-menu-item>
            <el-submenu index="1">
                <template slot="title"><i class="el-icon-s-opportunity"></i>节点管理</template>
                <el-menu-item-group>
                    <el-menu-item index="/user/node">节点列表</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
                <template slot="title"><i class="el-icon-s-home"></i>监测管理</template>
                <el-menu-item-group>
                    <el-menu-item index="/user/target">监测 IP 列表</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            
            <el-submenu index="3">
                <template slot="title"><i class="el-icon-menu"></i>IP 数据</template>
                <el-menu-item-group>
                    <el-menu-item index="/user/ip">IP 综合查询</el-menu-item>
                    <el-menu-item index="/user/ipReview">IP 审计</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title"><i class="el-icon-menu"></i>消息报警管理</template>
                <el-menu-item-group>
                    <el-menu-item index="/user/task">提醒任务管理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

            <el-submenu index="5">
                <template slot="title"><i class="el-icon-s-tools"></i>设置</template>
                <el-menu-item-group>
                    <el-menu-item index="/user/password">修改密码</el-menu-item>
                    <!-- <el-menu-item index="/user/info">修改信息</el-menu-item> -->
                    <el-menu-item index="/" @click="logout"> 退出登录</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

        </el-menu>
    </el-aside>
</template>
  
<script>
export default {
    name: 'adminPanel',

    data() {
        return {
            user: JSON.parse(window.localStorage.getItem("user"))
        }
    },
    methods: {
        logout() {
            this.axios.get('/api/logout')
            localStorage.removeItem("user");
        }
    }
}
</script>

<style>
.el-aside {
    height: 93vh;
}
</style>