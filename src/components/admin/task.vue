<template>
    <el-tabs type="border-card">
        <el-tab-pane label="任务管理"></el-tab-pane>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input placeholder="请输入任务名" v-model="username" clearable></el-input>
            </el-col>
            <el-col :span="6">
                <el-row>
                    <el-button type="primary" @click="search" plain>查询</el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 30px;">
            <el-col :span="6">
                <el-button icon="el-icon-plus" size="small" @click="addTask" type="primary">添加新任务</el-button>
                <el-dialog title="添加新任务" :visible.sync="dialogVisible" width="30%">
                    <div>
                        <label>任务名：</label>
                        <el-input v-model="editForm.name"></el-input>
                    </div>
                    <div style="margin-top: 30px">
                        <label>任务类型：</label>
                        <el-radio-group v-model.number="editForm.type" size="small">
                            <el-radio-button :label="1">预估延时报警</el-radio-button>
                            <el-radio-button :label="2">预估丢包报警</el-radio-button>
                            <!--el-radio-button :label="3">延时报警</el-radio-button>
                            <el-radio-button :label="4">丢包报警</el-radio-button-->
                        </el-radio-group>
                    </div>
                    <div style="margin-top: 30px">
                        <label>送信类型：</label>
                        <el-radio-group v-model.number="editForm.callMethod" size="small">
                            <el-radio-button :label="1">邮箱</el-radio-button>
                            <!-- <el-radio-button :label="2">预估丢包报警</el-radio-button> -->
                            <!--el-radio-button :label="3">延时报警</el-radio-button>
                            <el-radio-button :label="4">丢包报警</el-radio-button-->
                        </el-radio-group>
                    </div>
                    <div style="margin-top: 30px">
                        <label>节点 IP：</label>
                        <el-select v-model="value_node" filterable placeholder="请选择" @change="getTargetInfo"
                            style="width: 100%">
                            <el-option v-for="item in options_node" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="margin-top: 30px">
                        <label>监测 IP：</label>
                        <el-select v-model="value" filterable placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="margin-top: 30px">
                        <label>参考 TTL</label>
                        <el-input v-model.number="editForm.ttl"></el-input>
                    </div>
                    <div v-if="(editForm.type == 1)" style="margin-top: 30px">
                        <label>RTT 报警阈值</label>
                        <el-input v-model.number="editForm.exceedRTT"></el-input>
                    </div>
                    <div v-if="(editForm.type == 2)" style="margin-top: 30px">
                        <label>丢包报警阈值</label>
                        <el-input v-model="editForm.exceedPacketLoss"></el-input>
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
            <el-table-column prop="name" label="任务名称" width="180">
            </el-table-column>
            <el-table-column prop="traceType" label="预警类型" :formatter="traceTypeFormat" width="180">
            </el-table-column>
            <el-table-column prop="callMethod" label="送信方法" :formatter="callMethodFormat" width="180">
            </el-table-column>
            <el-table-column prop="ttl" label="参考 TTL" width="180">
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-row :gutter="10">
                        <el-col :span="3">
                            <el-button icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑任务</el-button>
                            <el-dialog title="添加新任务" :visible.sync="dialogEditVisible" width="30%">
                                <div>
                                    <label>任务名：</label>
                                    <el-input v-model="editForm.name"></el-input>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>任务类型：</label>
                                    <el-radio-group v-model.number="editForm.type" size="small">
                                        <el-radio-button :label="1">预估延时报警</el-radio-button>
                                        <el-radio-button :label="2">预估丢包报警</el-radio-button>
                                        <!--el-radio-button :label="3">延时报警</el-radio-button>
                            <el-radio-button :label="4">丢包报警</el-radio-button-->
                                    </el-radio-group>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>送信类型：</label>
                                    <el-radio-group v-model.number="editForm.callMethod" size="small">
                                        <el-radio-button :label="1">邮箱</el-radio-button>
                                        <!-- <el-radio-button :label="2">预估丢包报警</el-radio-button> -->
                                        <!--el-radio-button :label="3">延时报警</el-radio-button>
                            <el-radio-button :label="4">丢包报警</el-radio-button-->
                                    </el-radio-group>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>节点 IP：</label>
                                    <el-select v-model="value_node" filterable placeholder="请选择" @change="getTargetInfo"
                                        style="width: 100%">
                                        <el-option v-for="item in options_node" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>监测 IP：</label>
                                    <el-select v-model="value" filterable placeholder="请选择" style="width: 100%">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div style="margin-top: 30px">
                                    <label>参考 TTL</label>
                                    <el-input v-model.number="editForm.ttl"></el-input>
                                </div>
                                <div v-if="(editForm.type == 1)" style="margin-top: 30px">
                                    <label>RTT 报警阈值</label>
                                    <el-input v-model="editForm.exceedRTT"></el-input>
                                </div>
                                <div v-if="(editForm.type == 2)" style="margin-top: 30px">
                                    <label>丢包报警阈值</label>
                                    <el-input v-model="editForm.exceedPacketLoss"></el-input>
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="dialogEditVisible = false">取 消</el-button>
                                    <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
                                </span>
                            </el-dialog>
                        </el-col>
                        <el-col :span="2">
                            <el-button icon="el-icon-delete" @click="deleteConfirm(scope.$index, scope.row.ID)"
                                type="text">删除
                            </el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button icon="el-icon-s-claim" @click="testConfirm(scope.$index, scope.row.ID)"
                                type="text">立即测试
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
    name: "task",
    data() {
        return {
            username: "",
            options: [],
            options_node: [],
            value: [],
            value_node: [],
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
        traceTypeFormat(row) {
            switch (row.type) {
                case 1:
                return "预估延时报警"
                case 2:
                return "预估丢包报警"
            }
        },
        callMethodFormat(row) {
            switch (row.callMethod) {
                case 1:
                    return "邮件"
                case 2:
                    return "短信"
            }
        },
        search() {
            this.loading = true
            this.axios.get('/api/task?page=' + this.pagination.page + "&size=" + this.pagination.sizes + "&parm=" + this.username).then((res) => {
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
            this.axios.get('/api/task?page=' + this.pagination.page + "&size=" + this.pagination.sizes).then((res) => {
                this.tableData = res.data.data
                this.pagination.total = res.data.total
                this.loading = false
                console.log(this.tableData)
            })

        },
        getNodeInfo() {
            this.axios({
                method: 'get',
                url: '/api/user/nodes',
            }).then((d) => {
                if (d.data.code == 200) {
                    this.dialogEditVisible = false
                    this.options_node = d.data.data
                } else {
                    this.$message({
                        type: "error",
                        message: d.data.error
                    })
                }
            })
        },
        getTargetInfo() {
            this.value = []
            this.axios({
                method: 'get',
                url: '/api/user/target/' + this.value_node,
            }).then((d) => {
                this.options = d.data
            })
        },
        dialogSubmit() {
            this.loading = true
            let postData = this.editForm
            postData.exceedRTT = parseInt( postData.exceedRTT)
            postData.exceedPacketLoss = parseFloat( postData.exceedPacketLoss)
            postData.node_id = parseInt(this.value_node)
            postData.targetID = parseInt(this.value)
            switch (this.dialogType) {
                case "add":
                    this.axios({
                        method: 'post',
                        url: '/api/task',
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
                        url: '/api/task',
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
        addTask() {
            this.editForm = {}
            this.value = []
            this.dialogType = "add"
            this.dialogVisible = true
        },
        deleteConfirm(index, id) {
            this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
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
        testConfirm(index, id) {
            this.$confirm('此操作将立即测试该规则, 如果验证发生了拥塞将立即发送通知，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.testRow(index, id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消测试'
                })
            })
        },
        handleEdit(row) {
            console.log(row)
            this.dialogType = "mod"
            this.dialogEditVisible = true
            this.editForm = row
            this.value_node = row.node_id
            this.getTargetInfo()
            this.value = row.targetID
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        deleteRow(index, id) {
            this.axios.delete('/api/task/' + id).then((d) => {
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
        },
        testRow(index, id) {
            this.axios.get('/api/task/test/' + id).then((d) => {
                if (d.data.code == 200) {
                    this.$message({
                        type: 'info',
                        message: d.data.msg,
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
        this.getNodeInfo()
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