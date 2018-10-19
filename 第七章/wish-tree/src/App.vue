<template>
  <div id="app">
    <WishTree />
  </div>
</template>

<script>
import WishTree from './components/WishTree.vue'

export default {
  name: 'app',
  components: {
    WishTree
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
