<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters(['selectedCards', 'cards'])
  },
  methods: {
    ...mapActions([
      'sortCardsByCreatedAt',
      'sortCardsByUpdatedAt',
      'sortCardsByTitle',
      'setSelectedCardsTo',
      'resetSelectedTags'
    ]),
    searchCards() {
      if (this.query) {
        this.resetSelectedTags()
        let params = { params: { query: this.query }}
        this.axios.get(`http://localhost:3000/cards/`, params).then(
          response => this.setSelectedCardsTo(response.data)
        )
      } else {
        this.clearCards()
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
      <div class="show-options" @click="clearCards">Clear Cards</div>
    </div>

    <div id="sort-section" v-if="selectedCards.length">
      Sort By:
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
  color: grey;
}

.sort-options {
  margin-top: 2px;
  margin-left: 10px;
}

.option {
  cursor: pointer;
  &:hover {
    color: black;
  }
}
</style>
