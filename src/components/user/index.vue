<template>
    <div class="main">
        <h2>欢迎您！{{ username }}</h2>
        <el-row class="dashboarddata" :gutter="180">
            <el-col :span="6">
                <div>
                    <el-statistic group-separator="," :value="statistics.node" title="节点数"></el-statistic>
                </div>
            </el-col>
            <el-col :span="6">
                <div>
                    <el-statistic group-separator=","  :value="statistics.target" title="监测数"></el-statistic>
                </div>
            </el-col>
            <el-col :span="6">
                <div>
                    <el-statistic group-separator=","  :value="statistics.task" title="任务数"></el-statistic>
                </div>
            </el-col>
        </el-row>
        <div v-loading="mapLoading" class="map-container" id="map-container">
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminIndex",
    data() {
        return {
            username: "user",
            statistics: {},
            map: null,
            OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: [],
            mapLoading: true,
        }
    },
    methods: {
        getIPWhois(ip) {
            this.axios({
                method: 'get',
                url: 'https://ipwho.is/' + ip,
            }).then((d) => {
                if (d.data.success == false) {
                    return
                }
                d = d.data
                this.$utils.map.addMarker(this.map, d.latitude, d.longitude)
            })
        },
        getIPGeo() {
            this.axios({
                method: 'get',
                url: '/api/user/nodes',
            }).then((d) => {
                if (d.data.code == 200) {
                    d.data.data.forEach(element => {
                        this.getIPWhois(element.label)
                    });
                    this.mapLoading = false
                } else {
                    this.$message({
                        type: "error",
                        message: d.data.error
                    })
                }
            })
        },

        getStatisticsData() {
            this.axios({
                method: 'get',
                url: '/api/dash/statistics',
            }).then((d) => {
                if (d.data.code == 200) {
                    this.statistics = d.data
                } else {
                    this.$message({
                        type: "error",
                        message: d.data.error
                    })
                }
            })
        },

    },
    mounted() {
        this.getStatisticsData()
        this.map = this.$utils.map.createMap("map-container");
        // 设施地图视图 中心位置
        this.map.setView([33.94336, 103.886719], 2);

        // 加载 open street map和mapbox 图层服务
        this.$utils.map.createTileLayer(this.map, this.OSMUrl, { maxZoom: 8 });
        this.getIPGeo()
    }
}
</script>

<style scoped>
.main {
    padding: 20px 0px 0px 60px;
    width: 80%;
}

.dashboarddata {
    display: flex;
    text-align: center;
    /* justify-content: center; */
}

.map-container {
    /* position: absolute;
  left: 0;
  top: 0; */
    margin-top: 30px;
    width: 100%;
    height: 70%;
}
</style>