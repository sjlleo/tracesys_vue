<template>
    <el-table v-if="isshow" :data="tableData" style="width: 100%; margin-top: -70px;" height="800"
        :row-class-name="tableRowClassName">
        <el-table-column prop="ttl" label="TTL" width="50px">
        </el-table-column>
        <el-table-column prop="ip_list" label="IP" width="fix-content">
            <template slot-scope="scope">
                <pre v-for="ip in scope.row.ip_list">{{ ip }}</pre>
            </template>
        </el-table-column>
        <el-table-column :formatter="pklsFormatter" prop="packet_loss" label="Loss%" width="90px">
        </el-table-column>
        <el-table-column :formatter="avgrttFormatter" prop="avgRTT" label="RTT" width="90px">
        </el-table-column>
        <el-table-column :formatter="stdevFormatter" prop="ttl" label="stDev">
        </el-table-column>
    </el-table>
</template>
  
<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}

.el-table .error-row {
    background: #f9ebeb;
}
</style>
  
<script>
export default {
    methods: {
        getGeo() {
            this.tableData.forEach((r, i) => {
                r.ip_list.forEach(async (ip, q) => {
                    let str = await this.getGeoPromise(ip)
                    this.tableData[i].ip_list[q] += str
                    // this.isshow = false
                    // this.$nextTick(() => {
                    //     this.isshow = true
                    // })
                })

            })

            // this.$set(this.tableData,index,row);
        },
        async getGeoPromise(row) {
            let str = ''
            await this.axios.get('https://ip.trace.ac/api/v1/' + row + '?token=leomoe2022').then((r) => {
                str = " " + r.data.country + " " + r.data.prov + " " + r.data.city;
            })
            return str
        },
        pklsFormatter(row) {
            if (row.packet_loss != undefined) {
                return row.packet_loss * 100 + '%'
            }
        },
        avgrttFormatter(row) {
            if (row.avgRTT != undefined) {
                return row.avgRTT.toFixed(2) + 'ms'
            }
        },
        stdevFormatter(row) {
            if (row.avgRTT != undefined) {
                return (row.maxRTT - row.minRTT).toFixed(2) + 'ms'
            }
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.maxRTT - row.minRTT > 20) {
                return 'warning-row'
            }
            if (row.maxRTT - row.minRTT > 50 || row.packet_loss > 0.5) {
                return 'error-row'
            }
            return '';
        },
        ASCTableDataByID() {
            return this.tableData.sort((before, after) => before.ttl - after.ttl)
        },
        AddNullHop() {
            let d = this.tableData
            for (let i = 0; i < d.length - 1; i++) {
                if (d[i].ttl + 1 != d[i + 1].ttl) {
                    let obj = {
                        ttl: i + 2,
                        ip_list: ["*"],
                    }
                    d.splice(i + 1, 0, obj)
                    i++
                }
            }
            this.$nextTick()
        },
        FilterHop() {
            let latest_time = this.tableData[0].created_time
            this.tableData = this.tableData.filter((v) => latest_time == v.created_time)
        },
        InitTable(d) {
            this.tableData = []
            this.tableData = Array.from(d)
            this.ASCTableDataByID()
            this.AddNullHop()
            this.FilterHop()
            this.getGeo()
        }
    },
    data() {
        return {
            tableData: [],
            isshow: true
        }
    },
    mounted() {
        this.$bus.$on('routeTableData', this.InitTable)
        console.log(this.isshow)
    }
}
</script>