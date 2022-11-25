<template>
    <div>
        <div style="margin-top: 20px">
            <el-radio-group v-model="$route.params.nodeID" size="small">
                <el-radio-button v-for="k in nodeIDarr" index="/chart/" :key="k" :label="k"></el-radio-button>
            </el-radio-group>
        </div>
        <div ref="chart" style="width: 600px;height:400px;"></div>
    </div>
</template>

<script>

export default {
    name: 'Echarts',
    data() {
        return {
            ip: "",
            nodeIDarr: [],
            myChart: undefined,
            chartData: []
        }
    },
    methods: {
        goNewChart(id) {
            this.$router.replace({
                name: 'Chart',
                params: {
                    nodeID: id,
                    method: parseInt(this.$route.params.method),
                    targetIP: this.$route.params.targetIP,
                }
            })
        },
        fetchNodeInfo() {
            this.axios({
                url: '/api/target/' + this.ip,
                method: 'GET',
            }).then((d) => {
                this.nodeIDarr = d.data.nodeid
            })
        },
        fetchData(postData) {
            this.axios({
                method: 'post',
                url: "/api/result",
                data: postData,
            }).then((d) => {
                this.chartData = d.data.res
                this.chartData = this.chartData.filter((v) => {
                    return v.created_time == this.chartData[0].created_time
                })
                this.chartData = this.chartData.sort((before, after) => before.ttl - after.ttl)
                this.myEcharts()
            })
        },
        myEcharts() {
            this.myChart.hideLoading();
            const base = 0
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.myChart;

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: 'TTL 抖动横向对比表',
                    subtext: this.chartData[0].created_time,
                    left: 'center'
                },
                // visualMap: {
                //     show: false,
                //     dimension: 0,
                //     pieces: [{
                //         lte: 3,
                //         color: 'green'
                //     }, {
                //         gt: 3,
                //         lte: 4,
                //         color: 'red'
                //     }, {
                //         gt: 4,
                //         lte: 14,
                //         color: 'green'
                //     }, {
                //         gt: 14,
                //         lte: 17,
                //         color: 'red'
                //     }, {
                //         gt: 17,
                //         color: 'green'
                //     }]
                // },
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
                        return params[2].name + '<br />' + params[2].value.toFixed(2) + 'ms';
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.chartData.map(function (item) {
                        return item.ttl;
                    }),
                    axisLabel: {
                        formatter: function (value, idx) {
                            return value
                            // var date = new Date(value);
                            // console.log(idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-'))
                            // return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
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
                    type: 'line',
                    data: this.chartData.map(function (item) {
                        return item.avgRTT;
                    }),
                    hoverAnimation: false,
                    symbolSize: 6,
                    itemStyle: {
                        color: '#c23531'
                    },
                    showSymbol: false
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    },
    async mounted() {
        this.myChart = this.echarts.init(this.$refs.chart);
        this.myChart.showLoading();
        await this.$bus.$on('ttlChartData', (data) => {
            this.ip = data.targetIP
            this.fetchData(data)
        })
        this.fetchNodeInfo()
    },
    beforeDestroy() {
        this.$bus.$off('ttlChartData')
    }
}
</script>