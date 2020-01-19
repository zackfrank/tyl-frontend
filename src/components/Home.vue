<script>
import SearchBar from './SearchBar'
import CardList from './CardList'
import TagList from './TagList'
import ManageBar from './ManageBar'
import { mapActions } from 'vuex'

export default {
  created: function() {
    this.axios.get('http://localhost:3000/tags').then(
      response => { this.setTags(response.data) }
    );
    this.axios.get('http://localhost:3000/cards').then(
      response => { this.setCards(response.data) }
    );
  },
  components: {
    SearchBar,
    TagList,
    CardList,
    ManageBar
  },
  methods: {
    ...mapActions(['setTags', 'setCards'])
  }
}
</script>

<template>
  <main>
    <SearchBar/>
    <ManageBar/>
    <TagList/>
    <CardList/>
  </main>
</template>

<style scoped>
main {
  margin-top: 30px;
}
</style>
