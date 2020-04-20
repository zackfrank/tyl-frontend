<script>
import { mapGetters, mapActions } from 'vuex'
import ManageTagsModal from './ManageTagsModal'
import ActionAlertModal from './ActionAlertModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

export default {
  computed: {
    ...mapGetters(['tagDeleted', 'tagUpdated', 'tags', 'token'])
  },
  components: {
    ManageTagsModal,
    ActionAlertModal,
    ConfirmDeleteModal
  },
  data () {
    return {
      showManageTagsModal: false,
      showConfirmDeleteModal: false,
      selectedTag: {}
    }
  },
  methods: {
    ...mapActions(['triggerTagDeleted', 'logOut']),
    goHome() {
      this.$router.push('/')
    },
    signOut() {
      this.logOut()
      this.$router.push('/login')
    },
    setUpToDeleteTag(tag) {
      this.selectedTag = tag
      this.showConfirmDeleteModal = true
    },
    deleteTag() {
      this.axios.delete(`/tags/${this.selectedTag.id}`).then(
        () => {
          this.showConfirmDeleteModal = false
          this.triggerTagDeleted()
          let index = this.tags.indexOf(this.selectedTag)
          this.tags.splice(index, 1)
        }
      )
    }
  }
}
</script>

<template>
  <header>
    <h1>
      <router-link to="/">
        <span style="opacity: 0.1">#</span><span style="opacity: 0.2">tag</span><span style="opacity: 0.3">your</span><span style="opacity: 0.4">life</span>
      </router-link>
    </h1>

    <!-- Nav Menu -->
    <nav id="navMenu" v-if="token">
      <ul>
        <li><a @click="showManageTagsModal = true">Manage Tags</a></li>
        <li><a>Profile</a></li>
        <li><a>About</a></li>
        <li><a @click="signOut">Sign Out</a></li>
      </ul>
    </nav>
    <!-- End Nav Menu -->
    <ManageTagsModal
      v-if="showManageTagsModal"
      @close="showManageTagsModal = false"
      @setUpToDeleteTag="setUpToDeleteTag"
    />
    <ConfirmDeleteModal
      v-if="showConfirmDeleteModal"
      :tag="true"
      @confirmDelete="deleteTag"
      @goBack="showConfirmDeleteModal = false"
    />
    <ActionAlertModal
      v-if="tagDeleted"
      :tagDeleted="true"
    />
    <ActionAlertModal
      v-if="tagUpdated"
      :tagUpdated="true"
    />
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