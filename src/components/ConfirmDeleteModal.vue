<script>
export default {
  props: {
    card: {
      type: Boolean,
      default: false,
      required: false
    },
    tag: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  methods: {
    confirmDelete() {
      this.$emit('confirmDelete')
    },
    goBack() {
      this.$emit('goBack')
    }
  }
}
</script>

<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h3 class="modal-title">
            Are you sure you want to delete this
            <span v-if="card">card</span>
            <span v-if="tag">tag</span>?
          </h3>

          <div v-if="tag" class="center bold tag-message">
            <div class="message-part"><span id="note">NOTE</span>: Tag will be removed</div>
            <div class="message-part">from any active and archived cards</div>
          </div>

          <!-- Close Button -->
          <div class="modal-footer footer">
            <button class="modal-default-button" @click="goBack">
              <span class="bold">GO BACK</span>
            </button>
            <button class="modal-default-button" @click="confirmDelete">
              <span class="bold">DELETE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang=scss scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
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
  width: 30%;
  min-width: 370px;
  height: 200px;
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
  padding-top: 9%;
  margin-top: 15px;
  color: #d44950;
}

#note {
  text-decoration: underline;
}

.tag-message {
  font-size: 14px;
  text-transform: uppercase;
}

.message-part {
  margin-top: 8px;
}

.modal-footer {
  text-align: center;
  width: 100%;
  left: 0;
  margin-bottom: 10px;
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