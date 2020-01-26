<script>
import SearchBar from './SearchBar'
import CardList from './CardList'
import TagList from './TagList'
import ManageBar from './ManageBar'
import { mapActions, mapGetters } from 'vuex'

export default {
  created: function() {
    this.axios.get('http://localhost:3000/tags').then(
      response => { this.setTags(response.data) }
    )
    this.axios.get('http://localhost:3000/cards').then(
      response => { this.setCards(response.data) }
    )
  },
  computed: {
    ...mapGetters(['unfilteredCards'])
  },
  watch: {
    unfilteredCards(cards) {
      this.setSubTags(cards)
    }
  },
  components: {
    SearchBar,
    TagList,
    CardList,
    ManageBar
  },
  methods: {
    ...mapActions(['setTags', 'setCards', 'setSubTags'])
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
