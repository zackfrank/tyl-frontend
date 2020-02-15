<script>
export default {
  props: {
    created: {
      type: Boolean,
      required: false,
      default: false
    },
    deleted: {
      type: Boolean,
      required: false,
      default: false
    },
    archived: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h3 class="modal-title" id="created" v-if="created">
            Card Created!
          </h3>
          <h3 class="modal-title" id="deleted" v-if="deleted">
            - Card Deleted -
          </h3>
          <h3 class="modal-title" id="archived" v-if="archived">
            - Card Archived -
          </h3>
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
  transition: opacity 1.2s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 30%;
  height: 100px;
  margin: 0px auto;
  padding: 2px 30px 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 1.2s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
  display: table;
}

h3 {
  display: table-cell;
  vertical-align: middle;
  font-size: 24px;
  text-align: center;
}

#created {
  color: #42b983;
}

#deleted {
  color: #d44950;
}

#archived {
  color: #55108B;
  opacity: 0.7;
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

.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>