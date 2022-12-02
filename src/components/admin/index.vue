<template>
    <div class="main">
        <h2>欢迎您！{{ username }}</h2>
        <el-row class="dashboarddata" :gutter="180">
            <el-col :span="6">
                <div>
                    <el-statistic group-separator="," :precision="2" :value="value2" :title="title"></el-statistic>
                </div>
            </el-col>
            <el-col :span="6">
                <div>
                    <el-statistic title="男女比">
                        <template slot="formatter">
                            456/2
                        </template>

                    </el-statistic>
                </div>
            </el-col>
            <el-col :span="6">
                <div>
                    <el-statistic group-separator="," :precision="2" decimal-separator="." :value="value1"
                        :title="title">
                        <template slot="prefix">
                            <i class="el-icon-s-flag" style="color: red"></i>
                        </template>
                        <template slot="suffix">
                            <i class="el-icon-s-flag" style="color: blue"></i>
                        </template>
                    </el-statistic>
                </div>

            </el-col>
            <el-col :span="6">
                <div>
                    <el-statistic :value="like ? 521 : 520" title="Feedback">
                        <template slot="suffix">
                            <span @click="like = !like" class="like">
                                <i class="el-icon-star-on" style="color:red" v-show="!!like"></i>
                                <i class="el-icon-star-off" v-show="!like"></i>
                            </span> </template>
                    </el-statistic>
                </div>
            </el-col>
        </el-row>
        <div v-loading="mapLoading" class="map-container" id="map-container"></div>
    </div>
</template>

<script>
export default {
    name: "AdminIndex",
    data() {
        return {
            username: "admin",
            like: true,
            value1: 4154.564,
            value2: 2222,
            title: "今年的增长",
            input: "Hello Element UI!",
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
                url: 'http://ipwho.is/' + ip,
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

    },
    mounted() {
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