<script>
// import { mapGetters, mapActions } from 'vuex'

export default {

}
</script>

<template>
  <section>
    <select>
      <option value="displayAddTag">Add New Tag</option>
      <option value="displayAddCard">Add New Card</option>
    </select>
  </section>
</template>

<style lang=scss scoped>
section {
  width: 18%;
  float: right;
  border-left: 1px solid grey;
  height: 80vh;
  margin-top: 0;
}

select {
  display: block;
  margin: auto;
}
</style>