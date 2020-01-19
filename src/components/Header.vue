<script>
export default {
  data () {
    return {
      inbox: []
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    signOut () {
      this.$router.push('/login')
    }
  }
}
</script>

<template>
  <header>
    <h1>
      <a href="">
        <span style="opacity: 0.1">#</span><span style="opacity: 0.2">tag</span><span style="opacity: 0.3">your</span><span style="opacity: 0.4">life</span>
      </a>
    </h1>

    <!-- Nav Menu -->
    <nav id="navMenu">
      <ul>
        <li><a @click="signOut">Sign Out</a></li>
      </ul>
    </nav>
    <!-- End Nav Menu -->
  </header>
</template>

<style scoped>
header {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  z-index: 999;
}

header li {
  margin: 20px;
}

header * {
  display: inline;
}

nav {
  position: absolute;
  right: 0;
}

a {
  text-decoration: none;
}

h1 {
  text-align: center;
  margin-left: 30px;
}

nav a {
  cursor: pointer;
  opacity: 0.6;
  transition: 0.15s;
}

nav a:hover {
  opacity: 1;
}
</style>