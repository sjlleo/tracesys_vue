<template>
    <el-dialog title="添加节点信息" :visible.sync="dialogVisible" width="30%">
        <div>
            <label>您的节点 IP：</label>
            <el-input v-model="editForm.IP"></el-input>
        </div>
        <div style="margin-top: 20px;">
            <label> 您的节点密钥：</label>

            <el-input placeholder="留空随机生成" v-model="editForm.secret">
            </el-input>
        </div>
        <div style="margin-top: 20px">
            <label>权限：</label>
            <el-radio-group v-model="editForm.Role" size="small">
                <el-radio-button label="1">管理员</el-radio-button>
                <el-radio-button label="2">用户</el-radio-button>
            </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "dialog",
    
}

</script>