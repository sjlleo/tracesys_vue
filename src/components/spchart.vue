<template>
    <div style="width: 100%;">
        <label>TTL：</label>
        <el-select style="margin-bottom: 10px;" v-model="select" @change="handleSelect" slot="prepend"
            placeholder="请选择">
            <el-option v-for="num in ttl_option" :key="num" :label="num" :value="num"></el-option>
        </el-select>
        <div ref="chart" style="height:400px;"></div>
        <div style="width:fit-content;">
            <el-tag style="background-color: #26ff00; color: black;">0% Loss</el-tag>
            <el-tag style="background-color: #00b8ff; color: azure;">10% Loss</el-tag>
            <el-tag style="background-color: #0059ff; color: azure;">20% Loss</el-tag>
            <el-tag style="background-color: #5e00ff; color: azure;">30% Loss</el-tag>
            <el-tag style="background-color: #7e00ff; color: azure;">40% Loss</el-tag>
            <el-tag style="background-color: #dd00ff; color: azure;">50% Loss</el-tag>
            <el-tag style="background-color: #ff0000; color: azure;">95% Loss</el-tag>
        </div>
    </div>
</template>

<script>
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
            subText: '',
            beforeIndex: 1,
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
            this.InitData()
        },
        countMaxTTL() {
            // 计算 TargetIP TTL 最小值
            var targetIPMinTTL = 30
            var nontargetIPMaxTTL = 0
            this.chartData.forEach((v, i) => {
                if (v.ttl > nontargetIPMaxTTL && v.ip_list.indexOf(this.$route.params.targetIP) == -1) {
                    nontargetIPMaxTTL = v.ttl
                }
                if (v.ip_list.indexOf(this.$route.params.targetIP) != -1 && v.ttl < targetIPMinTTL) {
                    if (this.chartData[0].method == 0 && v.ttl > nontargetIPMaxTTL || this.chartData[0].method != 0) {
                        console.log(nontargetIPMaxTTL)
                        console.log(targetIPMinTTL)

                        targetIPMinTTL = v.ttl
                    }
                }
                if (this.ttl_option.indexOf(v.ttl) == -1) {
                    this.ttl_option.push(v.ttl)
                }
            })
            this.ttl_option = this.ttl_option.filter((v) => v <= targetIPMinTTL)
            console.log(targetIPMinTTL)
            this.ttl_option.sort((a, b) => a - b)
            return targetIPMinTTL
        },
        DateAddSeconds(time, seconds) {
            time = time.replace(/\-/g, "/");
            time = time.toLowerCase();
            time = new Date(time)
            time = new Date(time.setSeconds(time.getSeconds() - seconds))
            return time.Format("yyyy-MM-dd hh:mm:ss");
        },
        GetDateDiff(startTime, endTime, diffType) {
            //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
            startTime = startTime.replace(/\-/g, "/");
            endTime = endTime.replace(/\-/g, "/");
            //将计算间隔类性字符转换为小写
            diffType = diffType.toLowerCase();
            var sTime = new Date(startTime); //开始时间
            var eTime = new Date(endTime); //结束时间
            //作为除数的数字
            var timeType = 1;
            switch (diffType) {
                case "second":
                    timeType = 1000;
                    break;
                case "minute":
                    timeType = 1000 * 60;
                    break;
                case "hour":
                    timeType = 1000 * 3600;
                    break;
                case "day":
                    timeType = 1000 * 3600 * 24;
                    break;
                default:
                    break;
            }
            return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
        },
        InitData() {
            let count = 1
            this.pieces = []
            this.beforeIndex = 1
            this.chartData = this.chartDataOrigin

            if (this.chartData[0] == undefined) {
                this.myChart.hideLoading();
                return
            }
            var targetIPMinTTL = this.countMaxTTL()
            if (this.select == undefined || this.ttl_option.indexOf(this.select) == -1) {
                this.select = this.ttl_option[this.ttl_option.length - 1]
            }
            this.subText = this.chartData[0].method == 0 ? "模式 - ICMP" : this.chartData[0].method != 1 ? "模式 - TCP" : "模式 - UDP"
            this.subText += " / TTL = " + this.select
            var tmpIndex = 1
            var tmpArr = { avgRTT: 0.00, created_time: "2022-11-26 13:40:12", interval: 6, ip_list: [this.$route.params.targetIP], maxRTT: 0.00, minRTT: 20000.00, packet_loss: 0.00, ttl: 1 }
            this.chartData.forEach((v, i) => {
                // 检查是否一次完整的路由记录已经遍历完成  
                if (v.ip_list.indexOf(this.$route.params.targetIP) != -1 && this.select == targetIPMinTTL) {
                    if (targetIPMinTTL == v.ttl) {
                        tmpIndex = i
                    }
                    var count = (1 - v.packet_loss) * 20

                    // tmpArr.ttl = targetIPMinTTL
                    // tmpArr.avgRTT += v.avgRTT * count
                    if (tmpArr.maxRTT < v.maxRTT) {
                        tmpArr.maxRTT = v.maxRTT
                    }
                    // if (tmpArr.minRTT > v.minRTT) {
                    //     tmpArr.minRTT = v.minRTT
                    // }
                    tmpArr.packet_loss += count

                }

                if (tmpArr.packet_loss != 0 && i < this.chartData.length - 1 && v.created_time != this.chartData[i + 1].created_time) {
                    // tmpArr.avgRTT /= tmpArr.packet_loss
                    // tmpArr.packet_loss /= 20
                    // tmpArr.created_time = v.created_time
                    this.chartData[tmpIndex].maxRTT = tmpArr.maxRTT
                    tmpArr = { avgRTT: 0.00, created_time: v.created_time, interval: 6, ip_list: [this.$route.params.targetIP], maxRTT: 0.00, minRTT: 20000.00, packet_loss: 0.00, ttl: 1 }
                }
            })
            // console.log(this.chartData)
            this.chartData = this.chartData.filter((v, i) => {

                if (v.ttl == this.select) {
                    if (v.packet_loss == 0) {
                        this.pieces.push({
                            lte: count,
                            color: '#26ff00'
                        })
                    } else if (v.packet_loss <= 0.1) {
                        this.pieces.push({
                            lte: count,
                            color: '#00b8ff'
                        })
                    } else if (v.packet_loss <= 0.2) {
                        this.pieces.push({
                            lte: count,
                            color: '#0059ff'
                        })
                    } else if (v.packet_loss <= 0.3) {
                        this.pieces.push({
                            lte: count,
                            color: '#5e00ff'
                        })
                    } else if (v.packet_loss <= 0.4) {
                        this.pieces.push({
                            lte: count,
                            color: '#7e00ff'
                        })
                    } else if (v.packet_loss <= 0.5) {
                        this.pieces.push({
                            lte: count,
                            color: '#dd00ff'
                        })
                    } else if (v.packet_loss < 1) {
                        this.pieces.push({
                            lte: count,
                            color: '#ff0000'
                        })
                    } else {
                        this.pieces.push({
                            lte: count,
                            color: '#ff0000'
                        })
                    }
                    count++
                    return true
                }
            })
            // 增加间隔空白
            let length = this.chartData.length
            console.log(length)
            for (var k = 0; k < length; k++) {
                var s
                let v = this.chartData[k]
                // 计算时间差
                if (this.beforeIndex != 1) {
                    s = this.GetDateDiff(this.chartData[this.beforeIndex].created_time, v.created_time, "second")
                    if (s > v.interval * 20) {
                        // console.log(s)
                        // 出现了超出间隔的2条相邻数据，开始插入
                        for (let j = 1; j < Math.floor(s / (v.interval * 20)); j++) {
                            let value = { "ttl": v.ttl, "interval": v.interval, "created_time": this.DateAddSeconds(v.created_time, 120 * j) }
                            // console.log(value)
                            this.chartData.splice(k, 0, value)
                            this.pieces.splice(k, 0, {
                                lte: k + 1,
                                color: '#26ff00'
                            })
                            // k++
                            length++
                        }
                        // console.log(this.pieces)
                        // console.log("大间隔")
                    }
                }
                this.pieces[k].lte = k + 1
                this.beforeIndex = k

                // console.log("now:" + v.created_time)
            }
            // this.chartData = this.chartData.sort((before, after) => before.created_time - after.created_time)
            // console.log(this.chartData)


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
                    subtext: this.subText,
                    left: 'center'
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: this.pieces
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                        xAxisIndex: [0]
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100,
                        xAxisIndex: [0]
                    }
                ],
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
                        if (params[2].value == undefined) {
                            return
                        }
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
                            return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-') + " " + [date.getHours().toString().padStart(2, 0), date.getMinutes().toString().padStart(2, 0)].join(':');
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
                },
                {
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
        this.$bus.$on('spChartData', async (data) => {
            this.myChart.showLoading();
            this.ttl_option = []
            await this.fetchData(data)
            // this.$nextTick()
        })
    },
    beforeDestroy() {
        this.$bus.$off('spChartData')
    }
}
</script>