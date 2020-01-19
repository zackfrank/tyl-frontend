<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  created() {
    this.selectAllValue = Math.random().toString(36).substring(7);
    this.clearAllValue = Math.random().toString(36).substring(7);
  },
  computed: {
    ...mapGetters(['availableTags', 'selectedTags'])
  },
  data () {
    return {
      tagToAdd: '',
      selectAllValue: '',
      clearAllValue: ''
    }
  },
  watch: {
    tagToAdd(value) {
      if (value === this.selectAllValue) {
        while (this.availableTags.length > 0) {
          this.selectTag(this.availableTags[0])
        }
      } else if (value === this.clearAllValue) {
        this.resetSelectedTags()
      } else if (!this.selectedTags.includes(value) && value !== '') {
        this.selectTag(value)
      }
      this.tagToAdd = '' ;
    }
  },
  methods: {
    ...mapActions(['selectTag', 'removeTag', 'resetSelectedTags'])
  }
}
</script>

<template>
  <section>
    <select v-model="tagToAdd">
      <option disabled value="">Select a Tag...</option>
      <option :value="selectAllValue" v-if="availableTags.length">-Select All-</option>
      <option :value="clearAllValue" v-if="selectedTags.length">-Clear All-</option>
      <option
        v-for="tag in availableTags"
        :key="tag.id"
        :value="tag">
        {{ tag.name }}
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
