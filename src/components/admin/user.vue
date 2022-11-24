<template>
    <el-tabs type="border-card">
        <el-tab-pane label="用户管理"></el-tab-pane>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input placeholder="请输入用户名" v-model="username" clearable></el-input>
            </el-col>
            <el-col :span="6">
                <el-row>
                    <el-button type="primary" @click="search" plain>查询</el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 30px;">
            <el-col :span="6">
                <el-button icon="el-icon-plus" size="small" @click="addUser" type="primary">添加用户</el-button>
                <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%">
                    <div>
                        <label>用户昵称：</label>
                        <el-input v-model="editForm.username"></el-input>
                    </div>
                    <div style="margin-top: 20px">
                        <label>权限：</label>
                        <el-radio-group v-model.number="editForm.role" size="small">
                            <el-radio-button :label="1">管理员</el-radio-button>
                            <el-radio-button :label="2">用户</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div style="margin-top: 30px">
                        <label>用户密码：</label>
                        <el-input show-password v-model="editForm.password"></el-input>
                    </div>
                    <div style="margin-top: 30px">
                        <label>用户邮箱：</label>
                        <el-input v-model="editForm.email"></el-input>
                    </div>
                    <div style="margin-top: 30px">
                        <label>用户电话</label>
                        <el-input v-model="editForm.phone"></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>

        <el-table v-loading="loading" style="margin-top: 20px;" :data="tableData">
            <el-table-column prop="ID" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="username" label="昵称" width="180">
            </el-table-column>
            <el-table-column prop="role" label="权限" width="180">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.role == 1">管理员</el-tag>
                    <el-tag v-if="scope.row.role == 2">用户</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-row :gutter="10">
                        <el-col :span="5">
                            <el-button icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-dialog title="添加用户" :visible.sync="dialogEditVisible" width="30%">
                                <div>
                                    <label>用户昵称：</label>
                                    <el-input v-model="editForm.username"></el-input>
                                </div>
                                <div style="margin-top: 20px">
                                    <label>权限：</label>
                                    <el-radio-group v-model.number="editForm.role" size="small">
                                        <el-radio-button :label="1">管理员</el-radio-button>
                                        <el-radio-button :label="2">用户</el-radio-button>
                                    </el-radio-group>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>用户密码：</label>
                                    <el-input show-password v-model="editForm.password"></el-input>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>用户邮箱：</label>
                                    <el-input v-model="editForm.email"></el-input>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>用户电话</label>
                                    <el-input v-model="editForm.phone"></el-input>
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="dialogEditVisible = false">取 消</el-button>
                                    <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
                                </span>
                            </el-dialog>
                        </el-col>
                        <el-col :span="5">
                            <el-button icon="el-icon-delete" @click="deleteConfirm(scope.$index, scope.row.ID)"
                                type="text">删除
                            </el-button>
                        </el-col>
                        <!-- <el-col :span="5">
                            <el-button icon="el-icon-s-marketing" @click="pushShow(scope.row)" type="text">查看数据
                            </el-button>
                        </el-col> -->
                    </el-row>


                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagination.page" :page-sizes="[7, 10, 20, 50, 100]" :page-size="pagination.sizes"
                layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
            </el-pagination>
        </div>
    </el-tabs>
</template>
  
<script>

export default {
    name: "user",
    data() {
        return {
            username: "",
            options: [],
            value: [],
            value_methods: [0],
            interval: 0,
            pagination: {
                page: 1,
                total: 0,
                sizes: 7,
            },
            loading: false,
            dialogVisible: false,
            dialogEditVisible: false,
            dialogType: "",
            tableData: [],
            editForm: {},
        }
    },
    methods: {
        search() {
            this.loading = true
            this.axios.get('/api/user?page=' + this.pagination.page + "&size=" + this.pagination.sizes + "&parm=" + this.username).then((res) => {
                this.tableData = res.data.data
                this.pagination.total = res.data.total
                this.loading = false
            })
        },
        handleSizeChange(size) {
            this.pagination.sizes = size
            this.refreshTable()
        },
        handleCurrentChange(page) {
            this.pagination.page = page
            this.refreshTable()
        },
        refreshTable() {
            this.loading = true
            this.axios.get('/api/user?page=' + this.pagination.page + "&size=" + this.pagination.sizes).then((res) => {
                this.tableData = res.data.data
                this.pagination.total = res.data.total
                this.loading = false
                console.log(this.tableData)
            })

        },
        dialogSubmit() {
            this.loading = true
            let postData = this.editForm
            switch (this.dialogType) {
                case "add":
                    this.axios({
                        method: 'post',
                        url: '/api/user',
                        data: postData
                    }).then((d) => {
                        if (d.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功"
                            })
                            this.loading = true
                            this.refreshTable()
                            this.dialogVisible = false
                        } else {
                            this.$message({
                                type: "error",
                                message: d.data.error
                            })
                        }
                        this.loading = false
                    })
                    break
                case "mod":
                    this.axios({
                        method: 'put',
                        url: '/api/user',
                        data: postData
                    }).then((d) => {
                        if (d.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: "修改成功"
                            })
                            this.dialogEditVisible = false

                        } else {
                            this.$message({
                                type: "error",
                                message: d.data.error
                            })
                        }
                        this.loading = false
                    })
            }


        },
        addUser() {
            this.editForm = {}
            this.value = []
            this.dialogType = "add"
            this.dialogVisible = true
        },
        deleteConfirm(index, id) {
            this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRow(index, id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleEdit(row) {
            console.log(row)
            this.dialogType = "mod"
            this.dialogEditVisible = true
            this.editForm = row

        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        deleteRow(index, id) {
            this.axios.delete('/api/user').then((d) => {
                if (d.data.code == 200) {
                    this.tableData.splice(index, 1)
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: d.data.error,
                    })
                }
            })
        }
    },
    mounted() {
        this.refreshTable()
    }
}

</script>
  
<style>
.el-tabs {
    width: 100%;
}

.block {
    margin-top: 30px;
}
</style>