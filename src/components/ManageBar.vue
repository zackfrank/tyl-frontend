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
      newTagName: '',
      cardAdded: false,
      tagAdded: false
    }
  },
  methods: {
    ...mapActions(['setCurrentCard', 'addNewCard', 'addNewTag']),
    createCard() {
      this.axios.post('http://localhost:3000/cards', { title: "New Card" }).then(
        response => {
          this.setCurrentCard(response.data)
          this.addNewCard(response.data)
          this.showCreateCardModal = true
        }
      )
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
    <!-- Add Card -->
    <div class="add-card">
      <div class="create-wrapper">
        <div
          id="create-button"
          @click="createCard"
        >
        +
        </div>
      </div>
    </div>
    <div class="feedback">
      <div v-if="cardAdded">New card added!</div>
    </div>

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
  height: 80vh;
  margin-top: 0;
}

select {
  display: block;
  margin-left: 8px;
}

.add-card {
  float: right;
  display: table;
  overflow: hidden;
  border-radius: 3px;
  cursor: pointer;
  text-align: center;
  font-size: 80px;
  height: 90px;
  width: 90px;
  color: white;
  background-color: #55108B;
  opacity: 0.5;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 0.9;
  }
}

.create-wrapper {
  display: table-cell;
  vertical-align: middle;
}

#create-button {
  width: 100%;
}

.input-wrapper {
  width: 200px;
}

.feedback {
  margin: 5px 0px 0px 8px;
  color: #42b983;
}
</style>