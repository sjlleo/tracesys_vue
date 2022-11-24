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
    }
  },
  mounted() {
    this.$bus.$on('reloadRouter', () => {
      this.reloadRouter()
    })
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  /* height: 99%; */
}
</style>
