<script>
import CardModal from './CardModal'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    ...mapGetters(['selectedTags', 'cards', 'selectedCards']),
  },
  components: {
    CardModal
  },
  methods: {
    ...mapActions(['setSelectedCards', 'setCurrentCard']),
    manageCard(card) {
      this.setCurrentCard(card)
      this.showModal = true
    }
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

    <!-- Cards -->
    <div 
      v-for="card in selectedCards"
      :key="card.id"
      class="card"
      @click="manageCard(card)"
    >
      {{ card.title }}
    </div>

    <!-- Card Modal -->
    <CardModal
      v-if="showModal"
      @close="showModal = false"
    >
    </CardModal>

  </section>
</template>

<style lang=scss scoped>
section {
  float: left;
  margin-top: 15px;
  margin-left: 8px;
  width: 62%;
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