<script>
import { mapActions } from 'vuex'
import CardModal from './CardModal'

export default {
  components: {
    CardModal
  },
  data() {
    return {
      showCreateCardModal: false,
      newCardTitle: '',
      newTagName: '',
      cardAdded: false,
      tagAdded: false
    }
  },
  methods: {
    ...mapActions(['setCurrentCard', 'addNewCard', 'addNewTag']),
    createCard() {
      if (this.newCardTitle) {
        this.axios.post('http://localhost:3000/cards', { title: this.newCardTitle }).then(
          response => {
            this.setCurrentCard(response.data)
            this.addNewCard(response.data)
            this.showCreateCardModal = true
            this.newCardTitle = ''
          }
        )
      }
    },
    // createTag() {
    //   if (this.newTagName) {
    //     this.axios.post('http://localhost:3000/tags', { name: this.newTagName }).then(
    //       response => {
    //         this.addNewTag(response.data)
    //         this.newTagName = ''
    //         this.tagAdded = true
    //         setTimeout(() => this.tagAdded = false, 5000)
    //       }
    //     )
    //   }
    // },
    closeCreateCardModal() {
      this.showCreateCardModal = false
      this.cardAdded = true
      setTimeout(() => this.cardAdded = false, 5000)
      this.setCurrentCard({})
    }
  }
}
</script>

<template>
  <section>
    <!-- Add Card -->
    <div class="add-card">
      <div class="input-wrapper">
        <input
          type="text"
          class="tylInput"
          v-model="newCardTitle"
          @keyup.enter="createCard"
          placeholder="New Card Title..."
          autocomplete="off"
        >
      </div>
    </div>
    <div class="feedback">
      <div v-if="cardAdded">New card added!</div>
    </div>

    <!-- Add Tag -->
    <!-- <div class="add-tag">
      <div class="input-wrapper">
        <input
          type="text"
          class="tylInput"
          v-model="newTagName"
          @keyup.enter="createTag"
          placeholder="New Tag Name..."
          autocomplete="off"
        >
      </div>
    </div>
    <div class="feedback">
      <div v-if="tagAdded">New tag added!</div>
    </div> -->

    <CardModal
      v-if="showCreateCardModal"
      @close="closeCreateCardModal"
    />
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
  margin-left: 8px;
}

.add-card, .add-tag {
  margin-left: 8px;
}

.add-tag {
}

.input-wrapper {
  width: 200px;
}

.feedback {
  margin: 5px 0px 0px 8px;
  color: #42b983;
}
</style>