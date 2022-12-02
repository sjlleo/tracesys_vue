<template>
    <div style="padding: 10px 0px 0px 54px;">
        <h2>监测IP：{{ $route.params.targetIP }}</h2>
        <el-row>
            <el-col :span="2">
                <el-button size="small" icon="el-icon-back" @click="$router.back()" round>返回</el-button>
            </el-col>

            <el-col :span="2">
                <el-button size="small" type="primary" icon="el-icon-refresh-right" @click="refresh" round>刷新数据</el-button>
            </el-col>

            <el-col :span="4">
                <span >节点ID：</span>
                <el-radio-group v-model="radioID" @change="handleChange" size="small">
                    <el-radio-button v-for="k in nodeIDarr" index="/chart/" :key="k" :label="k"></el-radio-button>
                </el-radio-group>
            </el-col>
        </el-row>

        <div class="Echarts">
            <el-row>
                <el-col :span="12">
                    <ttlchart></ttlchart>
                    <spchart></spchart>
                </el-col>
                <el-col :span="12">
                    <routeTable></routeTable>
                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
import ttlchart from '../ttlchart'
import spchart from '../spchart'
import routeTable from '../routeTable'

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export default {
    name: 'Echarts',

    data() {
        return {
            option: {},
            radioID: 0,
            nodeIDarr: [],
            refreshFlag: true,
        }
    },
    components: {
        ttlchart,
        spchart,
        routeTable
    },
    methods: {
        handleChange() {
            this.$router.replace({
                name: 'chartInfo',
                params: {
                    nodeID: this.radioID,
                    method: parseInt(this.$route.params.method),
                    targetIP: this.$route.params.targetIP,
                }
            })
            this.refresh()
            // this.$bus.$emit('reloadRouter')
        },
        fetchNodeInfo() {
            this.axios({
                url: '/api/target/' + this.$route.params.targetIP,
                method: 'GET',
            }).then((d) => {
                this.nodeIDarr = d.data.nodeid
            })
        },
        tableInit() {
            let d = new Date().Format("yyyy-MM-dd hh:mm:ss")
            this.option = {
                "method": parseInt(this.$route.params.method),
                "targetIP": this.$route.params.targetIP,
                "nodeID": parseInt(this.$route.params.nodeID),
            }
            this.radioID = parseInt(this.$route.params.nodeID)
            this.$bus.$emit('ttlChartData', this.option)
            this.option.endDate = d
            this.$bus.$emit('spChartData', this.option)
        },
        refresh() {
            // this.refreshFlag = false
            // this.refreshFlag = true
            this.tableInit()
        }
    },
    mounted() {
        this.fetchNodeInfo()
        this.tableInit()
    }
}
</script>

<style scoped>
.el-row {
    margin-top: 20px;
}
.Echarts{
    margin-top: 20px;
    width: 100%;
}
</style>