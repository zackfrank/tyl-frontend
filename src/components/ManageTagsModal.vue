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
    ...mapGetters(['tags', 'cards', 'tagDeleted'])
  },
  data() {
    return {
      selectedTag: {},
      tagName: '',
      showTags: false
    }
  },
  watch: {
    tagName(value) {
      if (value) {
        this.showTags = false
        if (!this.selectedTag.name) {
          this.tagName = ''
        }
      }
    },
    tagDeleted(value) {
      if (value) {
        this.clearTag()
      }
    }
  },
  methods: {
    ...mapActions([
      'setTags',
      'triggerTagUpdated'
    ]),
    closeModalOnEnter(event) {
      if (event.keyCode == 13) {
        this.$emit('close')
      }
    },
    cardCount(tag) {
      return this.cards.filter(
        card => card.tags.map(tag => tag.id).includes(tag.id)
      ).length
    },
    activeCount(tag) {
      let cards = this.cards.filter(card => !card.archived)
      return cards.filter(
        card => card.tags.map(tag => tag.id).includes(tag.id)
      ).length
    },
    archivedCount(tag) {
      let cards = this.cards.filter(card => card.archived)
      return cards.filter(
        card => card.tags.map(tag => tag.id).includes(tag.id)
      ).length
    },
    toggleShowTags() {
      if (!this.tagName) {
        this.showTags = !this.showTags
      }
    },
    selectTag(tag) {
      this.selectedTag = tag
      this.tagName = tag.name
      this.$refs.editTag.focus()
    },
    clearTag() {
      this.selectedTag = {}
      this.tagName = ''
    },
    clearTagOnDelete() {
      if (!this.tagName) {
        this.clearTag()
      }
    },
    updateTag() {
      this.axios.patch(`/tags/${this.selectedTag.id}`,
        { name: this.tagName }).then(() => {
          this.clearTag()
          this.triggerTagUpdated()
          this.axios.get('/tags').then(
            response => { this.setTags(response.data) }
          )
        }
      )
    },
    deleteTag() {
      this.$emit('setUpToDeleteTag', this.selectedTag)
    }
  }
}
</script>

<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop="showTags = false">
          <div
            @click="$emit('close')"
            id="close-icon"
            class="clickable light-responsive"
            @click.stop
          >
            &#10005;
          </div>
          <h3 class="modal-title">
            Manage Tags
          </h3>

          <div class="input-wrapper" @click.stop>
            <input
              type="text"
              class="tylInput"
              id="tag-input"
              placeholder="Select a tag..."
              v-model="tagName"
              ref="editTag"
              @click.stop="toggleShowTags"
              @keyup.esc="clearTag"
              @keyup.delete="clearTagOnDelete"
              @keyup.enter.stop="updateTag"
            >
            <div
              v-if="tagName && tagName !== selectedTag.name"
              id="save"
              class="green clickable responsive center"
              @click="updateTag"
            >
              Save
            </div>
          </div>
          <div
            class="drop-down-menu"
            id="tag-drop-down-menu"
            v-if="showTags"
            @click.stop
          >
            <div
              @click.stop="selectTag(tag)"
              class="drop-down-option"
              v-for="tag in tags"
              :key="tag.id"
            >
              {{ tag.name }} ({{ cardCount(tag) }})
            </div>
          </div>

          <div class="card-counts" v-if="tagName">
            <h4>This tag has:</h4>
            <div class="counts active">
              {{ activeCount(selectedTag) }} active cards
            </div>
            <div class="counts archived">
              {{ archivedCount(selectedTag) }} archived cards
            </div>
          </div>

          <div
            v-if="tagName"
            @click="deleteTag"
            id="delete"
            class="red clickable center bold responsive footer"
          >
            Delete Tag
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
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 35%;
  max-width: 330px;
  height: 260px;
  margin: 0px auto;
  padding: 2px 30px 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 1.2s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
}

#close-icon {
  float: right;
  margin-right: -20px;
  margin-top: 4px;
  font-size: 18px;
}

h3 {
  font-size: 24px;
  color: #42b983;
  text-align: center;
}

.drop-down-menu {
  position: absolute;
  left: 90px;
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

.input-wrapper {
  margin: auto;
  margin-top: 12px;
  width: 150px;
}

#save {
  margin-top: 4px;
}

#delete {
  width: 82px;
  left: 40%;
}

.responsive {
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
}

.light-responsive {
    opacity: 0.4;
  &:hover {
    opacity: 7;
  }
}

h4 {
  margin: 0px;
  margin-top: 5px;
}

.card-counts {
  text-align: center;
  border: 1px solid lightgrey;
  border-radius: 3px;
  width: 150px;
  margin: auto;
  margin-top: 35px;
}

.counts {
  margin-top: 5px;
  margin-bottom: 5px;
}

.active {
  color: #42b983;
}

.archived {
  color: #55108B;
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