<template>
    <div>
        <label>TTL：</label>
        <el-select style="margin-bottom: 10px;" v-model="select" @change="handleSelect" slot="prepend"
            placeholder="请选择">
            <el-option v-for="num in ttl_option" :key="num" :label="num" :value="num"></el-option>
        </el-select>
        <div ref="chart" style="width: 600px;height:400px;"></div>
        <div style="width: 800px;">
            <el-tag style="background-color: #26ff00; color: black;">0% Loss</el-tag>
            <el-tag style="background-color: #00b8ff; color: azure;">10% Loss</el-tag>
            <el-tag style="background-color: #0059ff; color: azure;">20% Loss</el-tag>
            <el-tag style="background-color: #5e00ff; color: azure;">30% Loss</el-tag>
            <el-tag style="background-color: #7e00ff; color: azure;">40% Loss</el-tag>
            <el-tag style="background-color: #dd00ff; color: azure;">50% Loss</el-tag>
            <el-tag style="background-color: #ff0000; color: azure;">90% Loss</el-tag>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Echarts',
    data() {
        return {
            myChart: undefined,
            chartDataOrigin: [],
            ttl_option: [],
            chartData: [],
            pieces: [],
            select: undefined,
        }
    },
    methods: {
        handleSelect() {
            console.log("log")
            this.InitData()
        },
        countMaxTTL() {
            this.chartData.forEach((v) => {
                if (this.ttl_option.indexOf(v.ttl) == -1) {
                    this.ttl_option.push(v.ttl)
                }
            })
            this.ttl_option.sort((a, b) => a - b)
        },
        InitData() {
            let count = 1
            this.chartData = this.chartDataOrigin
            this.countMaxTTL()
            if (this.select == undefined) {
                this.select = this.ttl_option[this.ttl_option.length - 1]
            }
            this.chartData = this.chartData.filter((v) => {
                if (v.ttl == this.select) {
                    if (v.packet_loss == 0) {
                        this.pieces.push({
                            lte: count,
                            color: '#26ff00'
                        })
                    } else if (v.packet_loss < 0.1) {
                        this.pieces.push({
                            lte: count,
                            color: '#00b8ff'
                        })
                    } else if (v.packet_loss < 0.2) {
                        this.pieces.push({
                            lte: count,
                            color: '#0059ff'
                        })
                    } else if (v.packet_loss < 0.3) {
                        this.pieces.push({
                            lte: count,
                            color: '#5e00ff'
                        })
                    } else if (v.packet_loss < 0.4) {
                        this.pieces.push({
                            lte: count,
                            color: '#7e00ff'
                        })
                    } else if (v.packet_loss < 0.5) {
                        this.pieces.push({
                            lte: count,
                            color: '#dd00ff'
                        })
                    } else if (v.packet_loss < 1) {
                        this.pieces.push({
                            lte: count,
                            color: '#ff0000'
                        })
                    }
                    count++
                    return true
                }
            })
            this.chartData = this.chartData.sort((before, after) => before.created_time - after.created_time)

            this.myEcharts()
        },
        fetchData(postData) {

            this.axios({
                method: 'post',
                url: "/api/result",
                data: postData,
            }).then(async (d) => {
                this.chartDataOrigin = d.data.res
                this.InitData()
            })
        },
        myEcharts() {
            this.myChart.hideLoading();
            const base = 0
            // 基于准备好的dom，初始化echarts实例
            // var myChart = this.echarts.init(this.$refs.chart);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: 'SmokePing 经典阶梯表',
                    subtext: this.chartData[0].method == 0 ? "模式：ICMP" : this.chartData[0].method != 1 ? "模式：TCP" : "模式：UDP",
                    left: 'center'
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: this.pieces
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#ccc',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,

                            color: '#222'
                        }
                    },
                    formatter: function (params) {
                        return params[2].name + '<br />' + params[2].value.toFixed(2) + 'ms<br />';
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.chartData.map(function (item) {
                        return item.created_time;
                    }),
                    axisLabel: {
                        formatter: function (value, idx) {
                            // return value
                            var date = new Date(value);
                            // console.log(idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-'))
                            return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-') + " " + [date.getHours() + 1, date.getMinutes()].join(':');
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    boundaryGap: false
                },
                yAxis: {
                    axisLabel: {
                        formatter: function (val) {
                            return val + 'ms';
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return params.value.toFixed(2) + 'ms';
                            }
                        }
                    },
                    splitNumber: 3,
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: 'L',
                    type: 'line',
                    step: 'left',
                    data: this.chartData.map(function (item) {
                        // console.log(item.l)
                        return item.minRTT + base;
                    }),
                    lineStyle: {
                        opacity: 0
                    },
                    stack: 'confidence-band',
                    symbol: 'none'
                }, {
                    name: 'U',
                    step: 'left',
                    type: 'line',
                    data: this.chartData.map(function (item) {
                        return item.maxRTT - item.minRTT;
                    }),
                    lineStyle: {
                        opacity: 0
                    },
                    areaStyle: {
                        color: '#ccc'
                    },
                    stack: 'confidence-band',
                    symbol: 'none'
                }, {
                    step: 'left',
                    type: 'line',
                    data: this.chartData.map(function (item) {
                        return item.avgRTT;
                    }),
                    hoverAnimation: false,
                    symbolSize: 6,
                    itemStyle: {
                        color: '#ccc'
                    },
                    showSymbol: false
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(option);
        }
    },
    mounted() {
        this.myChart = this.echarts.init(this.$refs.chart)
        this.myChart.showLoading();
        this.$bus.$on('spChartData', (data) => {
            this.fetchData(data)
        })
    },
    beforeDestroy() {
        this.$bus.$off('spChartData')
    }
}
</script>