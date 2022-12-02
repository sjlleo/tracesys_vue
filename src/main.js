import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import axios from "axios";
import VForm from 'vform-builds'  //引入VForm库
import echarts from 'echarts'
import utils from './utils'
import 'vform-builds/dist/VFormDesigner.css'  //引入VForm样式

// 允许携带cookie
// axios.defaults.withCredentials = true

Vue.prototype.axios = axios;
Vue.prototype.echarts = echarts

Vue.prototype.$utils = utils

Vue.use(ElementUI);
Vue.use(VForm)



new Vue({
    el: '#app',
    render: h => h(App),
    router: router,
    beforeCreate() {
        Vue.prototype.$bus = this
    }
});