<template>
    <div style="width: 100%;">
        <navbar/>
        <el-container style="border: 1px solid #eee">
        <sidebar/>
        <router-view></router-view>
   </el-container>
    </div>

    
</template>

<script>
import sidebar from "../components/user/sidebar"
import navbar from "../components/navbar"
export default {
    name: 'userPanel',
    components: {sidebar, navbar},
}
</script>

<style>
.el-container {
    height: 100%;
}
</style>