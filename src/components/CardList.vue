<script>
import Card from './Card'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['selectedTags', 'cards', 'selectedCards']),
  },
  components: {
    Card
  },
  methods: {
    ...mapActions(['setSelectedCards'])
  },
  watch: {
    selectedTags(tags) {
      this.setSelectedCards(tags)
    }
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