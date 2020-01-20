<script>
import { mapActions } from 'vuex'
import CardModal from './CardModal'

export default {
  components: {
    CardModal
  },
  data() {
    return {
      manageOption: '',
      displayAddCard: false,
      displayAddTag: false,
      showCreateCardModal: false,
      newCardTitle: '',
      cardAdded: false
    }
  },
  watch: {
    manageOption(value) {
      if (value === "displayAddCard") {
        this.displayAddCard = true
        this.displayAddTag = false
      } else if (value === "displayAddTag") {
        this.displayAddCard = false
        this.displayAddTag = true
      }
      this.manageOption = ''
    }
  },
  methods: {
    ...mapActions(['setCurrentCard']),
    createCard() {
      if (this.newCardTitle) {
        this.axios.post('http://localhost:3000/cards', {title: this.newCardTitle}).then(
          response => {
            this.setCurrentCard(response.data)
            this.showCreateCardModal = true
          }
        )
      }
    },
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
    <select v-model="manageOption">
      <option disabled value="">Manage...</option>
      <option value="displayAddCard">Add New Card</option>
      <option value="displayAddTag">Add New Tag</option>
    </select>

    <!-- Add Card -->
    <div class="addCard" v-if="displayAddCard">
      <div class="inputWrapper">
        <input
          type="text"
          class="tylInput"
          v-model="newCardTitle"
          @keyup.enter="createCard"
          placeholder="Card Title..."
          autocomplete="off"
        >
      </div>
      <div class="feedback">
        <div v-if="cardAdded">New card added!</div>
      </div>
    </div>

    <!-- Display Add Tag -->
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

.addCard {
  margin: 25px 0 0 8px;
}

.inputWrapper {
  width: 200px;
}

.feedback {
  margin-top: 5px;
  color: #42b983;
}
</style>