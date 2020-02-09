<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['currentCard'])
  },
  methods: {
    abandon() {
      this.$emit('abandon')
    },
    goBack() {
      this.$emit('goBack')
    }
  }
}
</script>

<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h3 class="modal-title">
          Abandon card?
        </h3>
          <div class="details">THIS CARD WILL NOT BE SAVED</div>
          <div class="requirements">
            <div>
              This card is missing a
              <span
                v-if="!currentCard.title"
              >
                title
              </span>
              <span
                v-if="!currentCard.title && !currentCard.tags.length"
              >
                and a
              </span>
              <span
                v-if="!currentCard.tags.length"
              >
                tag
              </span>
            </div>
          </div>
        
        <!-- Close Button -->
        <div class="modal-footer">
          <button class="modal-default-button" @click="goBack">
            Go Back
          </button>
          <button class="modal-default-button" @click="abandon">
            Abandon Card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang=scss scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 40%;
  margin: 0px auto;
  padding: 2px 30px 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
}

h3 {
  text-align: center;
  margin-top: 15px;
  color: #42b983;
}

.details {
  text-align: center;
}

.requirements {
  text-align: center;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}

.modal-footer {
  text-align: center;
}

.modal-default-button {
  margin: 0px 20px 0 20px;
  display: inline-block;
  font-size: 16px;
  border: none;
  opacity: 0.7;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>