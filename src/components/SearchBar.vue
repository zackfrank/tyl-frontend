<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      query: '',
      archivedOnly: false,
      includeArchived: false
    }
  },
  watch: {
    cardSearchQuery(query) {
      if (query === '') {
        this.query = ''
      }
    },
    includeArchived(value) {
      this.setShowArchived(value)
      if (!value) {
        this.archivedOnly = false
      }
    },
    archivedOnly(value) {
      this.setShowActive(!value)
      if (value) {
        this.includeArchived = true
        this.setShowArchived(true)
      }
    },
    showArchived(value) {
      if (this.includeArchived !== value) {
        this.includeArchived = value
      }
    },
    showActive(value) {
      if (this.archivedOnly === value) {
        this.archivedOnly = !value
      }
    }
  },
  computed: {
    ...mapGetters([
      'cards',
      'cardSearchQuery',
      'unfilteredCards',
      'showArchived',
      'showActive'
    ])
  },
  methods: {
    ...mapActions([
      'sortCardsByCreatedAt',
      'sortCardsByUpdatedAt',
      'sortCardsByTitle',
      'filterSelectedCards',
      'resetSelectedTags',
      'setCardSearchQuery',
      'setShowArchived',
      'setShowActive'
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
        this.filterSelectedCards(searchResults)
      } else {
        this.clearCards()
        this.setCardSearchQuery('')
      }
    },
    showAllCards() {
      this.filterSelectedCards(this.cards)
    },
    clearCards() {
      this.query = ''
      this.archivedOnly = false
      this.includeArchived = false
      this.resetSelectedTags()
      this.filterSelectedCards([])
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

      <div id="sort-section" v-if="unfilteredCards.length">

        <!-- Sort By -->
        <div class="sort-sub-section">
          <span class="sort-option-header">Sort By:</span>
          <div class="sort-options">
            <div class="option" @click="sortCardsByTitle()">Title</div>
            <div class="option" @click="sortCardsByCreatedAt()">Date Created</div>
            <div class="option" @click="sortCardsByUpdatedAt()">Date Updated</div>
          </div>
        </div>

      <!-- Show/Hide Archived -->
        <div class="sort-sub-section">
          <div id="show-options-header">Show Options:</div>
          <span class="sort-option-header">Archived Tags:</span>
          <ul class="sort-options">
            <li class="checkbox-option">
              <input type="checkbox" v-model="includeArchived" class="show-options-checkbox">
              <label
                class="checkbox-label"
                @click="includeArchived = !includeArchived"
              >
                Include Archived
              </label>
            </li>
            <li class="checkbox-option">
              <input type="checkbox" v-model="archivedOnly" class="show-options-checkbox">
              <label
                class="checkbox-label"
                @click="archivedOnly = !archivedOnly"
              >
                Archived Only
              </label>
            </li>
          </ul>
        </div>

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

.sort-sub-section {
  margin-bottom: 10px;
}

.sort-option-header {
  opacity: 0.7;
  font-size: 14px;
}

#show-options-header {
  font-size: 15px;
  font-weight: bold;
  border-top: 1px solid grey;
  padding-top: 10px;
  margin-bottom: 8px;
}

.sort-options {
  margin-top: 5px;
  font-size: 14px;
}

.checkbox-option {
  opacity: 0.7;
  margin-left: 4px;
  margin-bottom: 5px;
}

.checkbox-label {
  cursor: pointer;
  margin-left: 4px;
}

.show-options-checkbox {
  /* Double-sized Checkboxes */
  -ms-transform: scale(1.3); /* IE */
  -moz-transform: scale(1.3); /* FF */
  -webkit-transform: scale(1.3); /* Safari and Chrome */
  -o-transform: scale(1.3); /* Opera */
  transform: scale(1.3);
  cursor: pointer;
}

.option {
  cursor: pointer;
  opacity: 0.4;
  &:hover {
    opacity: 0.7;
  }
}

ul, li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
