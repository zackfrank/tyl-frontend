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
      tagToAdd: '',
      showEditDescriptionBox: false,
      description: '',
      showEditTitleBox: false,
      title: '',
      tagFeedback: false
    }
  },
  watch: {
    tagToAdd(tag) {
      if (tag !== '') {
        this.addOrRemoveTagFromCard(tag);
      }
      this.tagToAdd = '' ;
    },
    showEditDescriptionBox(value) {
      if (value) {
        this.$nextTick(() =>
          this.$refs.description.focus()
        )
      }
    },
    showEditTitleBox(value) {
      if (value) {
        this.$nextTick(() =>
          this.$refs.title.focus()
        )
      }
    }
  },
  methods: {
    ...mapActions(['setCurrentCard']),
    addOrRemoveTagFromCard(tag) {
      this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`,
        { tag: tag }).then(
          response => {
            this.setCurrentCard(response.data)
            this.tagFeedback = false
          }
        )
    },
    addDescription() {
      if (this.description) {
        this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`,
          { description: this.description.trim() }).then(
            response => {
              this.setCurrentCard(response.data)
              this.showEditDescriptionBox = false
              this.description = ''
            }
          )
      }
    },
    toggleEditDescription() {
      this.showEditDescriptionBox = !this.showEditDescriptionBox
    },
    editDescription() {
      this.description = this.currentCard.description
      this.showEditDescriptionBox = true
    },
    editTitle() {
      this.title = this.currentCard.title
      this.showEditTitleBox = true
    },
    addTitle() {
      if (this.title.trim()) {
        this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`,
          { title: this.title.trim() }).then(
            response => {
              this.setCurrentCard(response.data)
              this.showEditTitleBox = false
              this.title = ''
            }
          )
      }
    },
    save() {
      if (this.description !== this.currentCard.description) {
        this.addDescription()
      }
      if (this.title.trim() !== this.currentCard.title) {
        this.addTitle()
      }
      this.showEditTitleBox = false
      this.showEditDescriptionBox = false
    },
    close() {
      this.save()
      if (this.currentCard.tags[0] && this.currentCard.title) {
        this.$emit('close')
      } else if (!this.currentCard.tags[0]) {
        this.tagFeedback = true
      }
    }
  }
}
</script>

<template>
  <transition name="modal">
    <div class="modal-mask" @click="close">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop="save">
          
          <!-- Title -->
          <div class="modal-title">
            <h3
              @click.stop="editTitle"
              v-if="!showEditTitleBox"
            >
              {{ currentCard.title }}
            </h3>
          </div>
          <input
            id="edit-title"
            type="text"
            v-model="title"
            ref="title"
            v-if="showEditTitleBox"
            @keyup.enter="addTitle()"
            @click.stop
          >

          <!-- Description -->
          <div class="modal-description">
            <div
              v-if="!currentCard.description"
              class="clickable edit-description"
              @click="toggleEditDescription"
            >
              Add a description
            </div>
            <textarea
              rows="4"
              v-model="description"
              ref="description"
              v-if="showEditDescriptionBox"
              @keyup.enter="addDescription()"
              @click.stop
            >
            </textarea>
            <span
              @click.stop="editDescription"
              v-if="!showEditDescriptionBox"
            >
              {{ currentCard.description }}
            </span>
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
              <span id="remove">x</span>
            </div>
            <span
              class="feedback"
              v-if="tagFeedback"
            >
              -- ADD AT LEAST ONE TAG --
            </span>
          </div>
          
          <!-- Close Button -->
          <div class="modal-footer">
            <button class="modal-default-button" @click="close">
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

.modal-title h3, #edit-title {
  margin-top: 15px;
  color: #42b983;
}

#edit-title {
  font-weight: bold;
  border: none;
  font-size: 1.17em;
  width: 95%;
  padding: 7px;
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

.feedback {
  color: #e44d2e;
  display: block;
  text-align: center;
  margin-bottom: 8px;
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

.edit-description {
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
  width: 130px;
  margin-bottom: 4px;
}

textarea {
  padding: 5px;
  font-size: 16px;
  width: 90%;
}
</style>