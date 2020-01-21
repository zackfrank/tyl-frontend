<script>
import CardModal from './CardModal'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      showCardModal: false,
      showArchived: false
    }
  },
  computed: {
    ...mapGetters(['selectedTags', 'cards', 'selectedCards']),
    filteredSelectedCards() {
      let cards
      if (!this.showArchived) {
        cards = this.selectedCards.filter(card => !card.archived)
      } else {
        cards = this.selectedCards
      }
      return cards
    }
  },
  components: {
    CardModal
  },
  methods: {
    ...mapActions(['setSelectedCardsFromTags', 'setCurrentCard', 'resetSelectedTags']),
    manageCard(card) {
      this.setCurrentCard(card)
      this.showCardModal = true
    },
    closeCardModal() {
      this.showCardModal = false
      this.setCurrentCard({})
    }
  },
  watch: {
    selectedTags(tags) {
      this.setSelectedCardsFromTags(tags)
    },
    // Render new cards on the fly as they are created if selected tag is added to new card
    cards() {
      this.setSelectedCardsFromTags(this.selectedTags)
    }
  }
}
</script>

<template>
  <section>
    <!-- Cards -->
    <div class="card-container">
      <div
        v-for="card in filteredSelectedCards"
        :key="card.id"
        class="card"
        @click="manageCard(card)"
      >
        {{ card.title }}
      </div>

      <!-- Card Modal -->
      <CardModal
        v-if="showCardModal"
        @close="closeCardModal"
      >
      </CardModal>
    </div>
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
