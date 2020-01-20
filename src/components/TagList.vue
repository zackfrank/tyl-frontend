<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['availableTags', 'selectedTags'])
  },
  data () {
    return {
      tagToAdd: ''
    }
  },
  watch: {
    tagToAdd(value) {
      if (!this.selectedTags.includes(value) && value !== '') {
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

    <!-- Main Show Options -->
    <div class="show-options-container" v-if="selectedTags[0]">
      <div class="show-options" @click="resetSelectedTags">Clear Tags</div>
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
