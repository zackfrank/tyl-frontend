<script>
import { mapGetters, mapActions } from 'vuex'
import CardModal from './CardModal'
import ConfirmCloseModal from './ConfirmCloseModal'
import CardActionAlertModal from './CardActionAlertModal'

export default {
  computed: {
    ...mapGetters(['cardCreated'])
  },
  components: {
    CardModal,
    ConfirmCloseModal,
    CardActionAlertModal
  },
  data() {
    return {
      showCreateCardModal: false,
      showConfirmCloseModal: false
    }
  },
  methods: {
    ...mapActions(['setCurrentCard']),
    openCardModal() {
      this.setCurrentCard({tags: []})
      this.showCreateCardModal = true
    },
    closeCreateCardModal() {
      this.showCreateCardModal = false
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
    <CardActionAlertModal
      v-if="cardCreated"
      :created="true"
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