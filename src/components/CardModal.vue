<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  mounted() {
    // Close modal on Enter
    document.addEventListener('keyup', this.closeModalOnEnter)
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
      tagToAdd: '',
      showEditDescriptionBox: false,
      description: '',
      showEditTitleBox: false,
      title: '',
      tagFeedback: false,
      tagQuery: '',
      tagMatches: [],
      showTags: false
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
        this.showEditDescriptionBox = false
        this.showEditTitleBox = false
      }
    },
    showDropDown(value) {
      if (value) {
        this.showTags = false
        this.showEditDescriptionBox = false
        this.showEditTitleBox = false
      }
    }
  },
  methods: {
    ...mapActions(['setCurrentCard', 'setCards', 'addNewTag']),
    closeModalOnEnter(event) {
      if (event.keyCode == 13) {
        this.close()
      }
    },
    addOrRemoveTagFromCard(tag) {
      this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`,
        { tag: tag }).then(() => {
          this.getAndResetCards()
          this.tagFeedback = false
          this.tagQuery = ''
        })
    },
    addTagToCard(tag) {
      this.addOrRemoveTagFromCard(tag)
      let index = this.availableTags.indexOf(tag)
      this.availableTags.splice(index, 1)
      this.tagMatches = this.availableTags
    },
    removeTagFromCard(tag) {
      this.addOrRemoveTagFromCard(tag)
      this.availableTags.push(tag)
    },
    // Extract tag creation (also in ManageBar) into central API
    getTagFromTagNameAndAddToCard() {
      if (this.tagQuery) {
        let existingTag = this.tags.find(
          tag => tag.name.toLowerCase() === this.tagQuery.toLowerCase()
        )
        if (existingTag) {
          this.addTagToCard(existingTag)
        } else {
          this.axios.post('http://localhost:3000/tags', { name: this.tagQuery }).then(
            response => {
              this.addNewTag(response.data)
              this.tagQuery = ''
              this.addTagToCard(response.data)
            }
          )
        }
      }
    },
    addDescription() {
      if (this.description.trim() !== this.currentCard.description) {
        this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`,
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
    editTitle() {
      this.title = this.currentCard.title
      this.showEditTitleBox = true
    },
    addTitle() {
      if (this.title.trim() && (this.title.trim() !== this.currentCard.title)) {
        this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`,
          { title: this.title.trim() }).then(() => {
            this.getAndResetCards()
          })
      }
      this.showEditTitleBox = false
      this.title = ''
    },
    toggleArchived(value) {
      this.axios.patch(`http://localhost:3000/cards/${this.currentCard.id}`,
        { archived: value }).then(() => {
          this.getAndResetCards()
        })
    },
    deleteCard() {
      this.axios.delete(`http://localhost:3000/cards/${this.currentCard.id}`).then(() => {
        this.$emit('close')
        this.setCurrentCard({})
        this.getAndResetCards()
      })
    },
    getAndResetCards() {
      this.axios.get('http://localhost:3000/cards').then(
        response => this.setCards(response.data)
      )
    },
    showAvailableTags() {
      if (!this.showTags) {
        this.tagMatches = this.availableTags
        this.showTags = true
      } else {
        this.showTags = false
      }
    },
    clearTagQuery() {
      this.tagQuery = ''
      this.showTags = false
    },
    save() {
      if (this.showEditDescriptionBox) {
        this.addDescription()
      }
      if (this.showEditTitleBox) {
        this.addTitle()
      }
      this.showDropDown = false
      this.showTags = false
    },
    close() {
      this.save()
      if (this.currentCard.tags.length && this.currentCard.title) {
        this.$emit('close')
      } else if (!this.currentCard.tags.length) {
        if (this.tagQuery) {
          this.getTagFromTagNameAndAddToCard()
          this.$emit('close')
        } else {
          this.tagFeedback = true
        }
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
          >
            <span>&#8226;&#8226;&#8226;</span>
          </div>
          <div
            id="drop-down-menu"
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
            @keyup.enter.stop="addTitle()"
            @click.stop
          >

          <!-- Description -->
          <div class="modal-description">
            <div
              v-if="!currentCard.description"
              class="clickable edit-description"
              @click.stop="toggleEditDescription"
            >
              Add a description
            </div>
            <textarea
              rows="4"
              v-model="description"
              ref="description"
              v-if="showEditDescriptionBox"
              @keyup.enter.stop="addDescription()"
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
            <hr>
            <div class="input-wrapper" @click.stop>
              <input
                type="text"
                class="tylInput"
                id="tag-input"
                placeholder="Add a tag..."
                v-model="tagQuery"
                @click.stop="showAvailableTags"
                @keyup.esc="clearTagQuery"
                @keyup.enter.stop="getTagFromTagNameAndAddToCard"
              >
            </div>
            <div
              v-if="tagQuery"
              id="create-tag-hint"
            >
              Enter to create/add new tag
            </div>
            <div
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
                @click="getTagFromTagNameAndAddToCard"
                class="drop-down-option"
                v-if="!tagMatches.length"
              >
                - Create Tag -
              </div>
            </div>
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
  margin: 0px auto;
  padding: 2px 30px 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
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

#drop-down-menu, #tag-drop-down-menu {
  background-color: white;
  width: 200px;
  padding: 8px;
  border-radius: 4px;
  float: right;
  margin-top: 20px;
  margin-right: -20px;
  color: #606060;
  display: inline-block;
  z-index: 9999;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .3);
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