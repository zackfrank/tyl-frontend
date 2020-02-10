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
    ...mapGetters([
      'selectedTags',
      'cards',
      'unfilteredCards',
      'filteredCards',
      'cardSearchQuery'
    ])
  },
  components: {
    CardModal
  },
  methods: {
    ...mapActions([
      'setFilteredCardsFromTags',
      'setCurrentCard',
      'resetSelectedTags',
      'setSearchResults',
      'filterSelectedCards'
    ]),
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
    // If tags weren't cleared bc of search or selecting All Cards, set cards from tags
    selectedTags(tags) {
      if (tags.length || !this.cardSearchQuery && !(this.unfilteredCards == this.cards)) {
        this.setFilteredCardsFromTags(tags)
      }
    },
    // Render new cards on the fly as they are created if selected tag is added to new card
    cards() {
      if (this.selectedTags.length) {
        this.setFilteredCardsFromTags(this.selectedTags)
      } else if (this.cardSearchQuery) {
        this.setSearchResults(this.cardSearchQuery)
      } else {
        this.filterSelectedCards(this.cards)
      }
    }
  }
}
</script>

<template>
  <section class="card-container">
    <!-- Cards -->
    <div
      v-for="card in filteredCards"
      :key="card.id"
      class="card"
      @click="manageCard(card)"
    >
      {{ card.title }}

      <div class="date-created">{{ card.date_created }}</div>
    </div>

    <!-- Card Modal -->
    <CardModal
      v-if="showCardModal"
      @close="closeCardModal"
    >
    </CardModal>
  </section>
</template>

<style lang=scss scoped>
section {
  float: left;
  margin-top: 15px;
  margin-left: 8px;
  mid-width: 260px;
  width: 260px;
  height: 73vh;
  overflow-y: scroll;
}

.card {
  width: 200px;
  padding: 15px;
  margin-top: 6px;
  background: #EEEEEE;
  box-shadow: 2px 2px 1px 0px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
  cursor: pointer;
  border-radius: 7px;
  &:hover {
    opacity: 1;
  };
}

.date-created {
  color: #55108B;
  margin-top: 10px;
  font-size: 11px;
}
</style>
