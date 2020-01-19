<script>
import Card from './Card'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['selectedTags', 'cards']),
    selectedCards () {
      if (this.selectedTags.length) {
        return this.cards.filter(
          card => this.selectedTags.every(
            tag => card.tags.includes(tag.name)
          )
        )
      } else {
        return []
      }
    }
  },
  components: {
    Card
  }
}
</script>

<template>
  <section>
    <div v-for="card in selectedCards" :key="card.id">
      {{ card.title }}
    </div>
    <Card/>
  </section>
</template>

<style scoped>
section {
  float: right;
  display: inline-block;
  margin-top: 15px;
  width: 81%;
}
</style>