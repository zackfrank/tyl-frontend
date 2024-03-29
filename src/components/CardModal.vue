<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  mounted() {
    // Close modal on Enter
    document.addEventListener('keyup', this.closeModalOnEnter)
    if (!this.currentCard.id) {
      this.showEditTitleBox = true
    }
  },
  destroyed() {
    document.removeEventListener('keyup', this.closeModalOnEnter)
  },
  computed: {
    ...mapGetters(['tags', 'cards', 'currentCard']),
    availableTags() {
      let available = []
      this.tags.forEach(tag => {
        if (!this.currentCard.tags.map(tag => tag.id).includes(tag.id)) {
          available.push(tag) 
        }
      })
      return available.sort((tag1, tag2) => {
        let name1 = tag1.name.toUpperCase()
        let name2 = tag2.name.toUpperCase()
        if (name1 < name2) { return -1 }
        if (name1 > name2) { return 1 }
        return 0;
      })
    },
    saveAndCloseText() {
      if (
           (!this.currentCard.id && this.currentCard.title && this.currentCard.tags.length) ||
           (this.showEditDescriptionBox &&
             (this.description.trim() !== (this.currentCard.description ? this.currentCard.description : ''))
           ) ||
           // title can not be null
           (this.title.trim() && (this.title.trim() !== this.currentCard.title))
         ) {
        return 'Save & Close'
      } else { return 'Close' }
    }
  },
  data() {
    return {
      showDropDown: false,
      showEditDescriptionBox: false,
      description: '',
      showEditTitleBox: false,
      title: '',
      tagFeedback: false,
      titleFeedback: false,
      alreadySelectedTagFeedback: false,
      tagQuery: '',
      tagMatches: [],
      showTags: false
    }
  },
  watch: {
    showEditDescriptionBox(value) {
      if (value) {
        this.showDropDown = false
        this.showTags = false
        this.$nextTick(() =>
          this.$refs.description.focus()
        )
      }
    },
    showEditTitleBox(value) {
      if (value) {
        this.showDropDown = false
        this.showTags = false
        this.$nextTick(() =>
          this.$refs.title.focus()
        )
      }
    },
    tagQuery(input) {
      if (input) {
        this.showTags = true
        this.tagMatches = this.availableTags.filter(tag => 
          tag.name.toLowerCase().includes(input.toLowerCase())
        )
      } else if (!input) {
        this.tagMatches = this.availableTags
      }
    },
    showTags(value) {
      if (value) {
        this.showDropDown = false
        this.showEditTitleBox = false
      }
    },
    showDropDown(value) {
      if (value) {
        this.showTags = false
        this.showEditDescriptionBox = false
        this.showEditTitleBox = false
      }
    },
    currentCard(value) {
      if (value.title) {
        this.titleFeedback = false
      }
    },
    alreadySelectedTagFeedback(value) {
      if (value) {
        setTimeout(() => {
         this.alreadySelectedTagFeedback = false
        }, 5000)
      }
    }
  },
  methods: {
    ...mapActions([
      'setCurrentCard',
      'setCards',
      'addNewTag',
      'addNewCard',
      'setTags',
      'triggerCardCreated',
      'triggerCardArchived'
    ]),
    closeModalOnEnter(event) {
      if (event.keyCode == 13) {
        this.close()
      }
    },
    addOrRemoveTagFromCard(tag) {
      this.axios.patch(`/cards/${this.currentCard.id}`,
        { tag: tag }).then(() => {
          this.getAndResetCards()
          this.tagFeedback = false
          this.tagQuery = ''
        })
    },
    addTagToCard(tag) {
      if (!this.currentCard.id) {
        this.currentCard.tags.push(tag)
        this.tagQuery = ''
      } else {
        this.addOrRemoveTagFromCard(tag)
      }
      let index = this.availableTags.indexOf(tag)
      this.availableTags.splice(index, 1)
      this.tagMatches = this.availableTags
      this.$nextTick(() =>
        this.$refs.tagQuery.focus()
      )
    },
    createCard() {
      if (!this.currentCard.id) {
        return this.axios.post('/cards',
          {
            title: this.currentCard.title,
            description: this.currentCard.description,
            tags: this.currentCard.tags
          }
        ).then(() => {
          this.triggerCardCreated()
          this.getAndResetCards()
          this.axios.get('/tags').then(
            response => { this.setTags(response.data) }
          )
        })
      }
    },
    deleteCard() {
      this.showDropDown = false
      this.$emit('showConfirmDeleteModal')
    },
    removeTagFromCard(tag) {
      if (!this.currentCard.id) {
        let index = this.currentCard.tags.indexOf(tag)
        this.currentCard.tags.splice(index, 1)
      } else {
        this.addOrRemoveTagFromCard(tag)
      }
    },
    // Extract tag creation (also in ManageBar) into central API
    getTagFromTagNameAndAddToCard() {
      if (this.tagQuery) {
        let existingTag = this.tags.find(
          tag => tag.name.toLowerCase() === this.tagQuery.toLowerCase()
        )
        if (existingTag && this.availableTags.includes(existingTag)) {
          this.addTagToCard(existingTag)
        } else if (existingTag && !this.availableTags.includes(existingTag)) {
          this.alreadySelectedTagFeedback = true
          this.tagQuery = ''
        } else {
          if (this.currentCard.id) {
            this.axios.post('/tags', { name: this.tagQuery }).then(
              response => {
                this.addNewTag(response.data)
                this.tagQuery = ''
                this.addTagToCard(response.data)
              }
            )
          } else {
            this.currentCard.tags.push({name: this.tagQuery})
            this.tagQuery = ''
          }
        }
      } else {
        // maybe this doesn't belong in this method
        // closing the modal by hitting Enter in the text field
        // should be handled another way
        this.close()
      }
    },
    createTagIfQuery() {
      if (this.tagQuery) {
        this.getTagFromTagNameAndAddToCard()
      }
    },
    addDescription() {
      if (!this.currentCard.id) {
        if (this.description.trim() !== this.currentCard.description) {
          this.currentCard.description = this.description
        }
      } else if (this.description.trim() !== this.currentCard.description) {
        this.axios.patch(`/cards/${this.currentCard.id}`,
          { description: this.description.trim() }).then(() => {
            this.getAndResetCards()
          })
      }
      this.showEditDescriptionBox = false
      this.description = ''
    },
    toggleEditDescription() {
      this.showEditDescriptionBox = !this.showEditDescriptionBox
    },
    editDescription() {
      this.description = this.currentCard.description
      this.showEditDescriptionBox = true
    },
    toggleEditTitle() {
      this.showEditTitleBox = !this.showEditTitleBox
    },
    editTitle() {
      this.title = this.currentCard.title
      this.showEditTitleBox = true
    },
    addTitle() {
      if (!this.currentCard.id) {
        if (this.title.trim() && (this.title.trim() !== this.currentCard.title)) {
          this.currentCard.title = this.title
        }
      } else if (this.title.trim() && (this.title.trim() !== this.currentCard.title)) {
        this.axios.patch(`/cards/${this.currentCard.id}`,
          { title: this.title.trim() }).then(() => {
            this.getAndResetCards()
          })
      }
      this.showEditTitleBox = false
      this.title = ''
    },
    toggleArchived(value) {
      this.axios.patch(`/cards/${this.currentCard.id}`,
      { archived: value }).then(() => {
        this.getAndResetCards()
        if (value) {
          this.$emit('close')
          this.setCurrentCard({})
          this.triggerCardArchived()
        }
      })
    },
    getAndResetCards() {
      this.axios.get('/cards').then(
        response => this.setCards(response.data)
      )
    },
    toggleTags() {
      if (!this.showTags) {
        this.tagMatches = this.availableTags
        this.showTags = true
      } else {
        this.showTags = false
      }
    },
    clearTagQuery() {
      this.tagQuery = ''
      // this.showTags = false // this broke adding tags -- refactor this
    },
    blurTagInput() {
      this.clearTagQuery()
      this.$refs.tagQuery.blur()
    },
    save() {
      if (!this.currentCard.id) {
        this.showTags = false
        return
      }
      if (this.showEditDescriptionBox) {
        this.addDescription()
      }
      if (this.showEditTitleBox) {
        this.addTitle()
      }
      this.showDropDown = false
      this.showTags = false
    },
    async close() {
      this.save()
      if (!this.currentCard.id) {
        if (this.currentCard.title && this.currentCard.tags.length) {
          await this.createCard()
          this.$emit('close')
        } else if (
            this.currentCard.title ||
            this.currentCard.description ||
            this.currentCard.tags.length
          ) {
          this.$emit('showConfirmCloseModal')
        } else {
          this.$emit('close')
        }
      } else if (this.currentCard.tags.length && this.currentCard.title) {
        this.$emit('close')
      } else if (!this.currentCard.tags.length) {
        if (this.tagQuery) {
          this.getTagFromTagNameAndAddToCard()
          this.close()
        } else {
          this.tagFeedback = true
        }
      } else {
        this.titleFeedback = true
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

          <!-- Drop-down Menu -->
          <div
            @click="showDropDown = !showDropDown"
            id="drop-down-icon"
            @click.stop
            v-if="currentCard.id"
          >
            <span>&#8226;&#8226;&#8226;</span>
          </div>
          <div
            class="drop-down-menu"
            id="card-drop-down-menu"
            v-if="showDropDown"
            @click.stop
          >
            <div
              @click="toggleArchived(!currentCard.archived)"
              class="drop-down-option"
            >
              <span v-if="!currentCard.archived">Archive</span>
              <span v-if="currentCard.archived">Un-archive</span>
            </div>
            <div
              @click="deleteCard"
              class="drop-down-option"
            >
              Delete
            </div>
          </div>

          <!-- Title -->
          <div class="modal-title">
            <h3
              v-if="!currentCard.title && !showEditTitleBox"
              class="clickable edit-title"
              @click.stop="toggleEditTitle"
            >
              Add a title
            </h3>
            <span
              class="feedback"
              id="title-feedback"
              v-if="titleFeedback"
            >
              Card must have a title
            </span>
            <h3
              @click.stop="editTitle"
              v-if="!showEditTitleBox"
            >
              {{ currentCard.title }}
            </h3>
          </div>
          <input
            placeholder="Add a title..."
            id="title"
            type="text"
            v-model="title"
            ref="title"
            v-if="showEditTitleBox"
            @keyup.esc="showEditTitleBox = false"
            @keyup.enter.stop="addTitle()"
            @blur="addTitle()"
            @click.stop
          >

          <!-- Description -->
          <div class="modal-description">
            <div
              v-if="!currentCard.description && !showEditDescriptionBox"
              class="clickable edit-description"
              @click.stop="toggleEditDescription"
            >
              Add a description
            </div>
            <textarea
              placeholder="Add a description..."
              rows="4"
              v-model="description"
              ref="description"
              @keyup.esc="showEditDescriptionBox = false"
              @keyup.enter.stop
              v-if="showEditDescriptionBox"
              @click.stop="showTags = false"
            >
            </textarea>
            <div
              class="clickable save"
              v-if="showEditDescriptionBox"
              @click="addDescription()"
            >
              Save
            </div>
            <div
              @click.stop="editDescription"
              v-if="!showEditDescriptionBox"
              class="description-box"
            >
              {{ currentCard.description }}
            </div>
          </div>

          <!-- Tag Section -->
          <div>
            <hr>
            <div
              v-for="tag in currentCard.tags"
              :key="tag.id"
              class="tags"
              @click="removeTagFromCard(tag)"
            >
              #{{ tag.name }}
              <span id="remove">x</span>
            </div>
            <span
              class="feedback"
              v-if="tagFeedback"
            >
              Add at least one tag
            </span>
            <span
              class="feedback"
              v-if="alreadySelectedTagFeedback"
            >
              Tag is already selected
            </span>
            <div class="input-wrapper" @click.stop>
              <input
                type="text"
                class="tylInput"
                id="tag-input"
                placeholder="Add a tag..."
                v-model="tagQuery"
                ref="tagQuery"
                @click.stop="toggleTags"
                @keyup.esc="blurTagInput"
                @keyup.enter.stop="getTagFromTagNameAndAddToCard"
                @blur="clearTagQuery"
              >
            </div>
            <div
              v-if="tagQuery"
              id="create-tag-hint"
            >
              Enter to create/add new tag
            </div>
            <div
              class="drop-down-menu"
              id="tag-drop-down-menu"
              v-if="showTags"
              @click.stop
            >
              <div
                @click="addTagToCard(tag)"
                class="drop-down-option"
                v-for="tag in tagMatches"
                :key="tag.id"
              >
                {{ tag.name }}
              </div>
              <div
                @click="createTagIfQuery"
                class="drop-down-option"
                v-if="!tagMatches.length"
              >
                - Create Tag -
              </div>
            </div>
          </div>
          
          <!-- Close Button -->
          <div class="modal-footer">
            <button class="modal-default-button" @click="close">
              {{ saveAndCloseText }}
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
  max-width: 450px;
  margin: 0px auto;
  padding: 2px 30px 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
}

#create-tag-hint {
  color: #55108B;
  opacity: 0.5f;
  font-size: 14px;
}

#drop-down-icon {
  display: inline-block;
  float: right;
  font-size: 20px;
  opacity: 0.6;
  cursor: pointer;
  margin-right: -20px;
  &:hover {
    opacity: 1;
  }
}

.drop-down-menu {
  position: absolute;
  max-height: 250px;
  overflow-y: scroll;
  z-index: 999;
  background-color: white;
  width: 200px;
  padding: 8px;
  border-radius: 4px;
  color: #606060;
  display: inline-block;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .3);
}

#card-drop-down-menu {
  right: 1%;
  margin-top: 20px;
}

#tag-drop-down-menu {
  margin-top: 10px;
  opacity: 0.9;
}

.drop-down-option {
  width: 100%;
  opacity: 0.7;
  cursor: pointer;
  padding: 8px;
  &:hover {
    opacity: 1;
  }
}

.modal-title h3, #title {
  margin-top: 15px;
  color: #42b983;
}

#title {
  font-weight: bold;
  border: none;
  font-size: 1.17em;
  width: 95%;
  padding: 7px;
  &::placeholder {
    color: #42b983;
    opacity: 0.5;
  }
}

.modal-description {
  margin: 20px 0;
}

.description-box {
  word-wrap: break-word;
}

textarea {
  max-width: 100%;
  min-width: 100%;
  max-height: 300px;
}

.save {
  width: 40px;
  display: block;
  color: #42b983;
  opacity: 0.6;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}

hr {
  margin: 30px 0 20px 0;
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

#title-feedback {
  display: inline-block;
}

.modal-footer {
  margin-top: 20px;
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

.edit-description, .edit-title {
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
}

.edit-description {
  width: 130px;
  margin-bottom: 4px;
}

.edit-title {
  width: 95px;
}

textarea {
  padding: 5px;
  font-size: 16px;
  width: 90%;
}
</style>