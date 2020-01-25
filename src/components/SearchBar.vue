<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      query: ''
    }
  },
  watch: {
    cardSearchQuery(query) {
      if (query === '') {
        this.query = ''
      }
    }
  },
  computed: {
    ...mapGetters(['selectedCards', 'cards', 'cardSearchQuery'])
  },
  methods: {
    ...mapActions([
      'sortCardsByCreatedAt',
      'sortCardsByUpdatedAt',
      'sortCardsByTitle',
      'setSelectedCardsTo',
      'resetSelectedTags',
      'setCardSearchQuery'
    ]),
    searchCards() {
      if (this.query) {
        this.setCardSearchQuery(this.query)
        this.resetSelectedTags()
        let searchResults = this.cards.filter(card =>
          card.title.toLowerCase().includes(this.query.toLowerCase()) ||
          (
            card.description &&
            card.description.toLowerCase().includes(this.query.toLowerCase())
          )
        )
        this.setSelectedCardsTo(searchResults)
      } else {
        this.clearCards()
        this.setCardSearchQuery('')
      }
    },
    showAllCards() {
      this.setSelectedCardsTo(this.cards)
    },
    clearCards() {
      this.query = ''
      this.resetSelectedTags()
      this.setSelectedCardsTo([])
    }
  }
}
</script>

<template>
  <section>
    <div class="input-wrapper">
      <input 
        type="text" 
        class="tylInput"
        placeholder="Search Cards..."
        autocomplete="off"
        v-model="query"
        @input="searchCards"
      >
    </div>

    <!-- Main Show Options -->
    <div class="show-options-container">
      <div class="show-options" @click="showAllCards">Show All Cards</div>
    </div>

    <div id="sort-section" v-if="selectedCards.length">
      <span id="sort-by">Sort By:</span>
      <div class="sort-options">
        <div class="option" @click="sortCardsByTitle()">Title</div>
        <div class="option" @click="sortCardsByCreatedAt()">Date Created</div>
        <div class="option" @click="sortCardsByUpdatedAt()">Date Updated</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 18%;
  float: left;
  border-right: 1px solid grey;
  height: 80vh;
}

#sort-section {
  margin-top: 10px;
  color: #55108B;
}

#sort-by {
  opacity: 0.7;
}

.sort-options {
  margin-top: 5px;
  font-size: 14px;
}

.option {
  cursor: pointer;
  opacity: 0.4;
  &:hover {
    opacity: 0.7;
  }
}
</style>
