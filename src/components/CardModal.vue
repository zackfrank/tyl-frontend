<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['tags', 'cards', 'currentCard']),
    availableTags() {
      let available = []
      this.tags.forEach(tag => {
        if(!this.currentCard.tags.map(tag => tag.id).includes(tag.id)) {
          available.push(tag) 
        }
      })
      return available
    }
  },
  data() {
    return {
      tagToAdd: ''
    }
  },
  watch: {
    tagToAdd(tag) {
      if (tag !== '') {
        this.addOrRemoveTagFromCard(tag);
      }
      this.tagToAdd = '' ;
    }
  },
  methods: {
    ...mapActions(['setCards']),
    addOrRemoveTagFromCard(tag) {
      let params = { tag: tag }
      this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`, params).then(
        response => { this.setCards(response.data) }
      )
    }
  }
}
</script>

<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          
          <!-- Title -->
          <div class="modal-title">
            <h3>{{ currentCard.title }}</h3>
          </div>

          <!-- Description -->
          <div class="modal-description">
            {{ currentCard.description }}
          </div>

          <!-- Tag Section -->
          <div class="modal-tags">
            <select v-model="tagToAdd">
              <option disabled value="">Add a Tag...</option>
              <option
                v-for="tag in availableTags"
                :key="tag.id"
                :value="tag">
                {{ tag.name }}
              </option>
            </select>
            <hr>
            <h4>Tags:</h4>
            <div 
              v-for="tag in currentCard.tags"
              :key="currentCard.tags.indexOf(tag)"
              class="tags"
              @click="addOrRemoveTagFromCard(tag)"
            >
              #{{ tag.name }}
              <span id='remove'>x</span>
            </div>
          </div>
          
          <!-- Close Button -->
          <div class="modal-footer">
            <button class="modal-default-button" @click="$emit('close')">
              Close
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
}

.modal-title h3 {
  margin-top: 15px;
  color: #42b983;
}

.modal-description {
  margin: 20px 0;
}

hr {
  margin: 30px 0 20px 0;
}

.modal-tags h4 {
  color: #42b983;
  margin-bottom: 4px;
  margin-top: 0;
}

#remove {
  margin-left: 4px;
  color: grey;
  opacity: 0;
}

.tags {
  display: inline-block;
  font-size: 16px;
  line-height: 20px;
  margin: 8px 0px 15px;
  padding-right: 15px;
  cursor: pointer;
  &:hover {
  opacity: 0.6;
  }
  &:hover > #remove {
    opacity: 1;
  }
}

.modal-footer {
  width: 100%;
}

.modal-default-button {
  margin: auto;
  display: block;
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