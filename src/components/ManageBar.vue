<script>
import { mapActions } from 'vuex'
import CardModal from './CardModal'
import ConfirmCloseModal from './ConfirmCloseModal'

export default {
  components: {
    CardModal,
    ConfirmCloseModal
  },
  data() {
    return {
      showCreateCardModal: false,
      showConfirmCloseModal: false,
      newTagName: '',
      cardAdded: false,
      tagAdded: false,
    }
  },
  methods: {
    ...mapActions(['setCurrentCard', 'addNewCard', 'addNewTag']),
    openCardModal() {
      this.setCurrentCard({tags: []})
      this.showCreateCardModal = true
    },
    closeCreateCardModal(cardCreated) {
      this.showCreateCardModal = false
      if (cardCreated) {
        this.cardAdded = true
      }
      setTimeout(() => this.cardAdded = false, 5000)
      this.setCurrentCard({})
    },
    closeModals() {
      this.closeCreateCardModal()
      this.showConfirmCloseModal = false
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
          @click="openCardModal"
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
      @showConfirmCloseModal="showConfirmCloseModal = true"
    />
    <ConfirmCloseModal
      v-if="showConfirmCloseModal"
      @abandon="closeModals"
      @goBack="showConfirmCloseModal = false"
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