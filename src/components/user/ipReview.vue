<template>
  <el-tabs type="border-card">
    <el-tab-pane label="IP 校准审计"></el-tab-pane>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入IP" @keyup.enter.native="search" v-model="ip" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-button type="primary" @click="search" plain>查询</el-button>
        </el-row>
        <el-row :gutter="15">
            <el-col :span="5">
              <el-button icon="el-icon-edit" type="text">添加 IP 审计</el-button>
              <el-dialog title="添加 IP 审计信息" :visible.sync="dialogVisible" width="30%">
                <div>
                  <label>IP：</label>
                  <el-input v-model="editForm.ip"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>Prefix：</label>
                  <el-input v-model.number="editForm.prefix"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>ASN 号码：</label>
                  <el-input v-model.number="editForm.asn"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>国家：</label>
                  <el-input v-model="editForm.country"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>省份：</label>
                  <el-input v-model="editForm.province"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>城市：</label>
                  <el-input v-model="editForm.city"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>域名：</label>
                  <el-input v-model="editForm.domain"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
                </span>
              </el-dialog>
            </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-table v-if="showtable" v-loading="loading" style="margin-top: 20px;" :data="tableData">
      <el-table-column prop="id" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="ip" label="IP" width="250">
      </el-table-column>
      <el-table-column prop="prefix" label="Prefix" width="250">
      </el-table-column>
      <el-table-column prop="asn" label="自治编号" width="150">
      </el-table-column>
      <el-table-column prop="domain" label="ISP 域名" width="90">
      </el-table-column>
      <el-table-column prop="createdTime" label="提交时间">
      </el-table-column>
      <el-table-column prop="authStatus" label="状态">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-row :gutter="15">
            <el-col :span="5">
              <el-button icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-dialog title="编辑 IP 审计信息" :visible.sync="dialogEditVisible" width="30%">
                <div>
                  <label>IP：</label>
                  <el-input v-model="editForm.ip"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>Prefix：</label>
                  <el-input v-model.number="editForm.prefix"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>ASN 号码：</label>
                  <el-input v-model.number="editForm.asn"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>国家：</label>
                  <el-input v-model="editForm.country"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>省份：</label>
                  <el-input v-model="editForm.province"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>城市：</label>
                  <el-input v-model="editForm.city"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label>域名：</label>
                  <el-input v-model="editForm.domain"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogEditVisible = false">取 消</el-button>
                  <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
                </span>
              </el-dialog>
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
import { nanoid } from 'nanoid';

export default {
  name: "node",
  data() {
    return {
      showtable: true,
      pagination: {
        page: 1,
        total: 0,
        sizes: 7,
      },
      loading: false,
      dialogVisible: false,
      dialogEditVisible: false,
      dialogType: "",
      loading: true,
      ip: "",
      tableData: [

      ],
      editForm: {},
    }
  },
  methods: {
    acceptReview(id) {
      this.axios.delete('/api/ip/pass/' + id).then((d) => {
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
    declineReview(id) {
      this.axios.delete('/api/ip/decline/' + id).then((d) => {
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
    search() {
      this.loading = true
      this.axios.get('/api/ip/list?page=' + this.pagination.page + "&size=" + this.pagination.sizes + "&parm=" + this.ip).then((res) => {
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
    async refreshTable() {
      this.loading = true
      await this.axios.get('/api/ip/list?page=' + this.pagination.page + "&size=" + this.pagination.sizes).then((res) => {
        this.tableData = res.data.data
        this.pagination.total = res.data.total
        this.loading = false
      })
    },
    dialogSubmit() {
      this.loading = true
      if (this.editForm.secret == undefined) {
        this.editForm.secret = nanoid()
      }
      switch (this.dialogType) {
        case "add":
          this.axios({
            method: 'post',
            url: '/api/ip/add',
            data: 'ip=' + this.editForm.IP + '&role=' + this.editForm.Role + '&secret=' + this.editForm.secret
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
            url: '/api/node/edit',
            data: this.editForm
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
      this.axios.delete('/api/ip/' + id).then((d) => {
        if (d.data.code == 200) {
          this.tableData.splice(index, 1)
          this.pagination.total = this.pagination.total - 1
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
  async mounted() {
    await this.refreshTable()
  }
}

</script>

<style>
.el-tabs {
  width: 100%;
}

.block {
  bottom: 30px;
  position: fixed;
}
</style>