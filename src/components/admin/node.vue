<template>
  <el-tabs type="border-card">
    <el-tab-pane label="节点管理"></el-tab-pane>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入IP" @keyup.enter.native="search" v-model="ip" clearable></el-input>
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
        <el-dialog title="添加节点信息" :visible.sync="dialogVisible" width="30%">
          <div>
            <label>您的节点 IP：</label>
            <el-input v-model="editForm.IP"></el-input>
          </div>
          <div style="margin-top: 20px;">
            <label> 您的节点密钥：</label>
            <el-input placeholder="留空自动生成" v-model="editForm.secret"></el-input>
          </div>
          <div style="margin-top: 20px">
            <label>权限：</label>
            <el-radio-group v-model="editForm.Role" size="small">
              <el-radio-button :label="1">管理员</el-radio-button>
              <el-radio-button :label="2">用户</el-radio-button>
            </el-radio-group>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="dialogSubmit">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>

    <el-table v-if="showtable" v-loading="loading" style="margin-top: 20px;" :data="tableData">
      <el-table-column prop="ID" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="IP" label="IP" width="250">
      </el-table-column>
      <el-table-column prop="geo" label="地理位置" width="150">
      </el-table-column>
      <el-table-column prop="Role" label="权限" width="90">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.Role == 1">管理员</el-tag>
          <el-tag v-if="scope.row.Role == 2">用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="secret" label="密钥" width="250">
      </el-table-column>
      <el-table-column prop="Lastseen" label="最后一次在线时间">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-row :gutter="15">
            <el-col :span="5">
              <el-button icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-dialog title="编辑节点信息" :visible.sync="dialogEditVisible" width="30%">
                <div>
                  <label>您的节点 IP：</label>
                  <el-input v-model="editForm.IP"></el-input>
                </div>
                <div style="margin-top: 20px;">
                  <label> 您的节点密钥：</label>
                  <el-input v-model="editForm.secret"></el-input>
                </div>
                <div style="margin-top: 20px">
                  <label>权限：</label>
                  <el-radio-group v-model="editForm.Role" size="small">
                    <el-radio-button :label="1">管理员</el-radio-button>
                    <el-radio-button :label="2">用户</el-radio-button>
                  </el-radio-group>
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
              <el-button icon="el-icon-connection" @click="deleteConfirm(scope.$index, scope.row.ID)" type="text">快捷对接
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
     getGeo() {
      this.tableData.forEach( async (r,i) => {
        let str = await this.getGeoPromise(r)
        this.tableData[i].geo = str
      })
      // this.$set(this.tableData,index,row);
    },
    async getGeoPromise(row) {
      let str = ''
      await this.axios.get('https://ip.trace.ac/api/v1/' + row.IP + '?token=leomoe2022').then((r) => {
        str =  " " + r.data.country + " " + r.data.prov + " " + r.data.city;
      })
      return str
    },
    search() {
      this.loading = true
      this.axios.get('/api/node/list?page=' + this.pagination.page + "&size=" + this.pagination.sizes + "&parm=" + this.ip).then((res) => {
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
      await this.axios.get('/api/node/list?page=' + this.pagination.page + "&size=" + this.pagination.sizes).then((res) => {
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
            url: '/api/node/add',
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
      this.axios.delete('/api/node/' + id).then((d) => {
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
  async mounted() {
    await this.refreshTable()
    this.getGeo()
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