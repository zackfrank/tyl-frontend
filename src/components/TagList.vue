/* global Vue axios */

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['availableTags', 'selectedTags'])
  },
  data () {
    return {
      tagToAdd: '',
    }
  },
  watch: {
    tagToAdd(value) {
      if (!this.selectedTags.includes(value) && value !== '') {
        this.selectTag(value);
      }
      this.tagToAdd = '' ;
    }
  },
  methods: {
    ...mapActions(['selectTag', 'removeTag'])
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

    <div class="selectedTags" v-for="tag in selectedTags" :key="tag.name">
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

<style scoped>
section {
  float: right;
  width: 81%;
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
}

.tagPills:hover > #remove {
  opacity: 1;
}

.tagPills:hover {
  opacity: 0.6;
}
</style>
