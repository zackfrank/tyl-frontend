<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'availableTags',
      'selectedTags',
      'selectedCards',
      'activeCards'
    ])
  },
  data () {
    return {
      tagToAdd: ''
    }
  },
  watch: {
    tagToAdd(tag) {
      if (!this.selectedTags.includes(tag) && tag !== '') {
        this.selectTag(tag)
      }
      this.tagToAdd = '' ;
    },
  },
  methods: {
    ...mapActions(['selectTag', 'removeTag', 'resetSelectedTags', 'setSelectedCardsTo']),
    clearAll() {
      this.resetSelectedTags()
      this.setSelectedCardsTo([])
    },
    cardCount(tag) {
      let count
      if (!this.selectedTags[0]) {
        // NUMBER OF CARDS WITH THIS TAG
        return this.activeCards.filter(card => card.tags.map(tag => tag.id).includes(tag.id)).length
      } else if (this.selectedTags.length > 0) {
        // NUMBER OF CARDS WITH THIS TAG PLUS SELECTED TAGS
        let selectedTagIds = this.selectedTags.map(tag => tag.id)
        selectedTagIds.push(tag.id)
        return this.activeCards.filter(card =>
          selectedTagIds.every(id => card.tags.map(tag => tag.id).includes(id))).length
      }

      return count
    },
    // Only display tags that have associated cards
    availableTagsWithCards() {
      return this.availableTags.filter(tag => this.cardCount(tag))
    }
  }
}
</script>

<template>
  <section>
    <select v-model="tagToAdd">
      <option disabled value="">Select a Tag...</option>
      <option
        v-for="tag in availableTagsWithCards()"
        :key="tag.id"
        :value="tag">
        {{ tag.name }} ({{ cardCount(tag) }})
      </option>
    </select>

    <div class="selectedTags" v-for="tag in selectedTags" :key="tag.id">
      <div
        class="tagPills"
        @click="removeTag(tag)"
      >
        #{{ tag.name }}
        <span id='remove'>x</span>
      </div>
    </div>

    <!-- Main Show Options -->
    <div class="show-options-container" v-if="selectedCards[0] || selectedTags[0]">
      <div class="show-options" @click="clearAll">Clear All</div>
    </div>
  </section>
</template>

<style lang=scss scoped>
section {
  float: left;
  width: 60%;
  margin-left: 8px;
}

.selectedTags {
  display: inline-block;
  margin-left: 8px;
}

#remove {
  margin-left: 4px;
  color: grey;
  opacity: 0;
}

.tagPills {
  display: inline-block;
  font-size: 16px;
  line-height: 20px;
  padding: 4px;
  padding-left: 6px;
  padding-right: 6px;
  cursor: pointer;
  &:hover > #remove {
    opacity: 1;
  }
  &:hover {
    opacity: 0.6;
  }
}
</style>
