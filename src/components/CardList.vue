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
    <div 
      v-for="card in selectedCards"
      :key="card.id"
      class="card"
    >
      {{ card.title }}
    </div>
    <Card/>
  </section>
</template>

<style lang=scss scoped>
section {
  float: right;
  display: inline-block;
  margin-top: 15px;
  width: 81%;
}

.card {
  width: 200px;
  padding: 15px 15px 15px 15px;
  margin-top: 6px;
  margin-right: 4px;
  background: #EEEEEE;
  box-shadow: 2px 2px 1px 0px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
  cursor: pointer;
  border-radius: 7px;
  &:hover {
    opacity: 1;
  };
}
</style>