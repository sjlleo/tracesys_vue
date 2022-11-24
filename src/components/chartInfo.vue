<template>
    <div style="margin-left: 20px;">
        <h2>监测IP：{{$route.params.targetIP}}</h2>
        <el-button type="primary" icon="el-icon-refresh-right" @click="refresh" round>刷新数据</el-button>
        <div class="Echarts">
            <el-row :gutter="10">
                <el-col :span="14"><ttlchart></ttlchart></el-col>
                <el-col :span="10"><spchart></spchart></el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
import ttlchart from '../components/ttlchart'
import spchart from '../components/spchart'

Date.prototype.Format = function (fmt) { // author: meizz
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
            option: {}
        }
    },
    components: {
        ttlchart,
        spchart
    },
    methods: {
        refresh() {
            this.$bus.$emit('reloadRouter')            
        }
    },
    mounted() {
        let d = new Date().Format("yyyy-MM-dd hh:mm:ss")
        this.option = {
            "method": parseInt(this.$route.params.method),
            "targetIP": this.$route.params.targetIP,
            "nodeID": parseInt(this.$route.params.nodeID),
        }
        this.$bus.$emit('ttlChartData', this.option)
        this.option.endDate =  d
        this.$bus.$emit('spChartData', this.option)
    }
}
</script>