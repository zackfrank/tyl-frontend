<script>
import Header from './components/Header'

export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<template>
  <div id="app">
    <Header/>
    <router-view/>
  </div>
</template>

<style>
  @import 'styles/styles.scss'
</style>
