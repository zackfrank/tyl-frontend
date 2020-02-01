<script>
export default {
  props: {
    show: Boolean
  }
}
</script>

<template>
  <span>
    <span
      class="show-arrow"
      v-if="!show"
      @click="$emit('show', true)"
    >
      ▼
    </span>
    <span
      class="show-arrow"
      v-if="show"
      @click="$emit('show', false)"
    >
      ▲
    </span>
  </span>
</template>

<style scoped>
.show-arrow {
  cursor: pointer;
  font-size: 10px;
}
</style>
