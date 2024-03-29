<script>
import CardModal from './CardModal'
import { mapGetters, mapActions } from 'vuex'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import ActionAlertModal from './ActionAlertModal'

export default {
  data() {
    return {
      showCardModal: false,
      showArchived: false,
      showConfirmDeleteModal: false
    }
  },
  computed: {
    ...mapGetters([
      'selectedTags',
      'cards',
      'unfilteredCards',
      'filteredCards',
      'cardSearchQuery',
      'currentCard',
      'cardDeleted',
      'cardArchived'
    ])
  },
  components: {
    CardModal,
    ConfirmDeleteModal,
    ActionAlertModal
  },
  methods: {
    ...mapActions([
      'setFilteredCardsFromTags',
      'setCurrentCard',
      'resetSelectedTags',
      'setSearchResults',
      'filterSelectedCards',
      'setCards',
      'triggerCardDeleted'
    ]),
    manageCard(card) {
      this.setCurrentCard(card)
      this.showCardModal = true
    },
    closeCardModal() {
      this.showCardModal = false
      this.setCurrentCard({})
    },
    deleteCard() {
      this.axios.delete(`/cards/${this.currentCard.id}`).then(() => {
        this.showCardModal = false
        this.showConfirmDeleteModal = false
        this.setCurrentCard({})
        this.getAndResetCards()
        this.triggerCardDeleted()
      })
    },
    getAndResetCards() {
      this.axios.get('/cards').then(
        response => this.setCards(response.data)
      )
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
      @showConfirmDeleteModal="showConfirmDeleteModal = true"
    >
    </CardModal>
    <ConfirmDeleteModal
      v-if="showConfirmDeleteModal"
      :card="true"
      @confirmDelete="deleteCard"
      @goBack="showConfirmDeleteModal = false"
    />
    <ActionAlertModal
      v-if="cardDeleted"
      :deleted="true"
    />
    <ActionAlertModal
      v-if="cardArchived"
      :archived="true"
    />
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
  border-radius: 3px;
  word-wrap: break-word;
  &:hover {
    opacity: 1;
  };
}

.card:nth-child(5n-0) {
  background: #FE4365;
}

.card:nth-child(5n-1) {
  background: #FC9D9A;
}

.card:nth-child(5n-2) {
  background: #F9CDAD;
}

.card:nth-child(5n-3) {
  background: #C8C8A9;
}

.card:nth-child(5n-4) {
  background: #83AF9B;
}

.date-created {
  color: #55108B;
  margin-top: 10px;
  font-size: 11px;
}
</style>
