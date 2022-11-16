<template>
    <div style="width: 100%;">
        <navbar/>
        <el-container style="height: 780px; border: 1px solid #eee">
        <sidebar/>
        <router-view></router-view>
   </el-container>
    </div>

    
</template>

<script>
import sidebar from "../components/sidebar"
import navbar from "../components/navbar"
export default {
    name: 'adminPanel',
    components: {sidebar, navbar},
}
</script>