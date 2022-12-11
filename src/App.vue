<template>
  <router-view v-if="isRouterAlive"></router-view>
</template>

<script>


export default {
  name: 'App',
  components: {},
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reloadRouter() {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    },
    islogin() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          background: 'rgba(255, 255, 255, 1)'
        });
      this.axios.get("/api/user/info").then(
        r => {
          if (r.data.code == 401) {
            console.log(this.$route.fullPath)
            if (this.$route.fullPath != "/") {
              this.$message({ type: 'error', message: '您的登录已过期或尚未登录'})

            }
            localStorage.removeItem("user");
            this.$router.push("/")
          } else {
            switch (r.data.role) {
                case 1:
                  if (this.$route.fullPath.indexOf("admin") == -1 && this.$route.fullPath.indexOf("chart") == -1) {
                    this.$router.push("/admin/dashboard")
                  }
                  break
                case 2:
                if (this.$route.fullPath.indexOf("user") == -1 && this.$route.fullPath.indexOf("chart") == -1) {
                    this.$router.push("/user/dashboard")
                  }
                  break
              }
          }
          loading.close();
        }
      )
    }
  },
  mounted() {
    this.$bus.$on('reloadRouter', () => {
      this.reloadRouter()
    })
    this.islogin()
  }
}
</script>

<style scoped>
html,
body {
  /* height: 100%; */
  width: 100%;
  margin: 0%;

}


body {
  display: flex;
  align-items: center;
  /* height: 99%; */
}
</style>
