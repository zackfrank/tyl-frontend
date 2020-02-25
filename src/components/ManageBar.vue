<script>
import { mapGetters, mapActions } from 'vuex'
import CardModal from './CardModal'
import ConfirmCloseModal from './ConfirmCloseModal'
import ActionAlertModal from './ActionAlertModal'

export default {
  computed: {
    ...mapGetters(['cardCreated'])
  },
  components: {
    CardModal,
    ConfirmCloseModal,
    ActionAlertModal
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
    <ActionAlertModal
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
  border-radius: 50%;
  cursor: pointer;
  text-align: center;
  font-size: 80px;
  height: 90px;
  width: 90px;
  color: white;
  background-color: #55108B;
  background: radial-gradient(#e66465, #55108B);
  opacity: 0.7;
  box-shadow: 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12), 0px 3px 5px -1px rgba(0,0,0,0.2), inset 1px 1px 0 rgba(0,0,0,.1), inset 0 -1px 0 rgba(0,0,0,.07);
  transition-property: after;
  transition-duration: .6s;
  position: relative;
  span {
    z-index: 20;
  }
  &:after {
    background: #fff;
    content: "";
    height: 155px;
    left: -75px;
    opacity: .2;
    position: absolute;
    top: -50px;
    transform: rotate(20deg);
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 50px;
    z-index: -10;
  }
  &:hover {
    opacity: 0.8;
    box-shadow: 0px 8px 12px 2px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12), 0px 3px 5px -1px rgba(0,0,0,0.2), inset 1px 1px 0 rgba(0,0,0,.1), inset 0 -1px 0 rgba(0,0,0,.07);
    &:after {
      left: 140%;
      transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    }
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