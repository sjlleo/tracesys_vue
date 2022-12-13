<template>
    <el-container>
            <el-header style="text-align: right; font-size: 15px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>{{ user.name }}</span>
            </el-header>

        </el-container>

        
</template>

<script>
export default {
    data() {
        return {
            user: JSON.parse(window.localStorage.getItem("user"))
        }
    },
    methods: {
        logout() {
            this.axios.get('/api/logout')
            localStorage.removeItem("user");
            this.$router.push('/')
        }
    }
}
</script>
<style>
 .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }</style>