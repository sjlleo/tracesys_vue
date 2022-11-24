<template>
  <el-tabs type="border-card">
    <el-tab-pane label="监测管理"></el-tab-pane>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入IP" v-model="ip" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-button type="primary" @click="search" plain>查询</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="6">
        <el-button icon="el-icon-plus" size="small" @click="addNode" type="primary">添加节点</el-button>
        <el-dialog title="添加监测信息" :visible.sync="dialogVisible" width="30%">
          <div>
            <label>监测 IP：</label>
            <el-input v-model="editForm.ip"></el-input>
          </div>
          <div style="margin-top: 30px">
            <label>监测间隔（秒）</label>
            <el-input v-model.number="editForm.interval"></el-input>
          </div>
          <div style="margin-top: 30px">
            <label>监测协议：</label>
            <el-select v-model="editForm.method" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in options_methods" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-if="editForm.method != 0" style="margin-top: 30px">
            <label>监测端口：</label>
            <el-input v-model.number="editForm.port"></el-input>
          </div>
          <div style="margin-top: 30px">
            <label>监测节点：</label>
            <el-select v-model="value" multiple filterable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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
      <el-table-column prop="ip" label="IP" width="180">
      </el-table-column>
      <el-table-column prop="interval" label="监测间隔" width="180">
      </el-table-column>
      <el-table-column prop="method" label="协议" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.method == 0">ICMP</el-tag>
          <el-tag v-if="scope.row.method == 1">TCP</el-tag>
          <el-tag v-if="scope.row.method == 2">UDP</el-tag>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-button icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-dialog title="编辑监控信息" :visible.sync="dialogEditVisible" width="30%">
                <div>
                  <label>您的监控 IP：</label>
                  <el-input v-model="editForm.ip"></el-input>
                </div>
                <div style="margin-top: 30px">
                  <label>监测间隔（秒）</label>
                  <el-input v-model.number="editForm.interval"></el-input>
                </div>
                <div style="margin-top: 30px">
                  <label>监测协议：</label>
                  <el-select v-model="editForm.method" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in options_methods" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div v-if="editForm.method != 0" style="margin-top: 30px">
                  <label>监测端口：</label>
                  <el-input v-model.number="editForm.port"></el-input>
                </div>
                <div style="margin-top: 30px">
                  <label>监测节点：</label>
                  <el-select v-model="value" multiple filterable placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>


                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogEditVisible = false">取 消</el-button>
                  <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
                </span>
              </el-dialog>
            </el-col>
            <el-col :span="5">
              <el-button icon="el-icon-delete" @click="deleteConfirm(scope.$index, scope.row.ID)" type="text">删除
              </el-button>
            </el-col>
            <el-col :span="5">
              <el-button icon="el-icon-s-marketing" @click="pushShow(scope.row)" type="text">查看数据
              </el-button>
            </el-col>
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
  name: "target",
  data() {
    return {
      options: [],
      options_methods: [
        { value: 0, label: "ICMP" },
        { value: 1, label: "TCP" },
        { value: 2, label: "UDP" },
      ],
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
      ip: "",
      nodeData: [],
      tableData: [
        {
          CreatedAt: '',
          CreatedUserID: '',
          DeletedAt: '',
          ID: '',
          interval: 10,
          method: 0,
          nodeid: [],
          ip: '',
          UpdateAt: ''
        }
      ],
      editForm: {},
    }
  },
  methods: {
    pushShow(rowData) {
      this.$router.push({
        name: 'chartInfo',
        params: {
          method: rowData.method,
          targetIP: rowData.ip,
          nodeID: rowData.nodeid[0]
        }
      })
    },
    search() {
      this.loading = true
      this.axios.get('/api/target/list?page=' + this.pagination.page + "&size=" + this.pagination.sizes + "&parm=" + this.ip).then((res) => {
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
      this.axios.get('/api/target/list?page=' + this.pagination.page + "&size=" + this.pagination.sizes).then((res) => {
        this.tableData = res.data.data
        this.pagination.total = res.data.total
        this.loading = false
        console.log(this.tableData)
      })

    },
    dialogSubmit() {
      this.loading = true
      let postData = this.editForm
      postData.nodeid = this.value
      switch (this.dialogType) {
        case "add":
          this.axios({
            method: 'post',
            url: '/api/target/add',
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
            url: '/api/target/edit',
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
    addNode() {
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
      this.value = row.nodeid
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
    getNodeInfo() {
      this.axios({
        method: 'get',
        url: '/api/user/nodes',
      }).then((d) => {
        if (d.data.code == 200) {
          this.dialogEditVisible = false
          this.options = d.data.data
        } else {
          this.$message({
            type: "error",
            message: d.data.error
          })
        }
      })
    },
    deleteRow(index, id) {
      this.axios.delete('/api/target/' + id).then((d) => {
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
    this.getNodeInfo()
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