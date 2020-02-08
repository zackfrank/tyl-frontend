<script>
import ToggleShowArrow from './ToggleShowArrow'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      query: '',
      archivedOnly: false,
      includeArchived: false,
      showSubtagsSection: false,
      showArchivedTagsSection: false
    }
  },
  components: {
    ToggleShowArrow
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
    },
    hiddenSubtags() {
      this.filterSelectedCards(this.unfilteredCards)
    },
    unfilteredCards(cards) {
      if (!cards.length) {
        this.showSubtagsSection = false
        this.showArchivedTagsSection = false
      }
    }
  },
  computed: {
    ...mapGetters([
      'cards',
      'cardSearchQuery',
      'unfilteredCards',
      'showArchived',
      'showActive',
      'subtags',
      'hiddenSubtags'
    ]),
    showOptions() {
      return (
        this.showArchived ||
        this.includeArchived ||
        this.hiddenSubtags.length
      )
    }
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
      'setShowActive',
      'setHiddenSubtags',
      'setSearchResults'
    ]),
    searchCards() {
      if (this.query) {
        this.resetSelectedTags()
        this.setSearchResults(this.query)
      } else {
        this.clearCards()
        this.setCardSearchQuery('')
      }
    },
    clearCards() {
      this.setCardSearchQuery('')
      this.clearShowOptions()
      this.filterSelectedCards(this.cards)
    },
    clearShowOptions() {
      this.archivedOnly = false
      this.includeArchived = false
      this.showSubtagsSection = false
      this.showArchivedTagsSection = false
      this.setHiddenSubtags([])
      this.filterSelectedCards(this.unfilteredCards)
    },
    addOrRemoveFromHiddenSubtags(tag) {
      if (this.hiddenSubtags.map(tag => tag.id).includes(tag.id)) {
        let subtagIds = this.hiddenSubtags.map(tag => tag.id)
        let index = subtagIds.indexOf(tag.id)
        this.hiddenSubtags.splice(index, 1)
      } else {
        this.hiddenSubtags.push(tag)
      }
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
        @keyup.esc="clearCards"
        @input="searchCards"
      >
    </div>

    <!-- Main Show Options -->
    <div class="show-options-container">
      <div
        class="show-options"
        v-if="query"
        @click="clearCards"
      >
        Clear Search
      </div>
      <div
        class="show-options"
        v-if="showOptions"
        @click="clearShowOptions"
      >
        Reset Show Options
      </div>

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

        <!-- SHOW OPTIONS -->
        <div class="sort-sub-section">
          <div id="show-options-header">Show Options:</div>

          <!-- Show/Hide Subtags -->
          <div class="sort-option-header">
            Subtags
            <ToggleShowArrow
              :show="showSubtagsSection"
              @show="showSubtagsSection = $event"
            />
          </div>
          <div v-if="showSubtagsSection">
            <div
              class="show-hide-options"
              @click="setHiddenSubtags([])"
            >
              Show All
            </div>
            <div
              class="show-hide-options"
              @click="setHiddenSubtags(subtags)"
            >
              Hide All
            </div>
            <ul class="sort-options">
              <li
                class="checkbox-option"
                v-for="tag in subtags"
                :key="tag.id"
                @click="addOrRemoveFromHiddenSubtags(tag)"
              >
                <input
                  type="checkbox"
                  class="show-options-checkbox"
                  :checked="!hiddenSubtags.map(tag => tag.id).includes(tag.id)"
                >
                <label
                  class="checkbox-label"
                >
                  {{ tag.name }}
                </label>
              </li>
            </ul>
          </div>

          <!-- Show/Hide Archived -->
          <div class="sort-option-header">
            Archived Tags 
            <ToggleShowArrow
              :show="showArchivedTagsSection"
              @show="showArchivedTagsSection = $event"
            />
          </div>
          <div v-if="showArchivedTagsSection">
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
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 18%;
  float: left;
  border-right: 1px solid grey;
  height: 80vh;
  min-width: 165px;
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
  margin-top: 8px;
}

#show-options-header {
  font-size: 15px;
  font-weight: bold;
  border-top: 1px solid grey;
  padding-top: 10px;
}

.sort-options {
  margin-top: 5px;
  font-size: 14px;
  margin-bottom: 14px;
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

.show-hide-options {
  font-size: 14px;
  cursor: pointer;
  margin-top: 5px;
  margin-left: 16px;
  display: inline-block;
  opacity: 0.4;
  &:hover {
    opacity: 0.7;
  }
}
</style>
