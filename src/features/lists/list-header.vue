<template>
  <page-header :background-image="imageSource">
    <div class="d-flex align-items-center">
      <h1 class="w-100">
        <invisible-input
          class="display-2 flex-grow-1 mb-2"
          :text="name"
          v-on:updated="saveName"
          class-list="text-white"
          placeholder="What is this list for..."
        />
      </h1>
      <div v-if="isListActive" class="align-self-center">
        <button
          type="button"
          class="list-dropdown btn btn-secondary btn-sm bg-transparent"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="fas fa-ellipsis-h fa-fw"></i>
        </button>
        <div
          class="dropdown-menu"
          x-placement="left-start"
          style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-196px, 0px, 0px);"
        >
          <div class="dropdown-header">Edit list</div>
          <a href="#" class="dropdown-item" v-on:click.prevent="$emit('show-picture-selector')">
            <i class="fas fa-image fa-fw mr-2"></i>
            <span>Change picture</span>
          </a>
          <a href="#" class="dropdown-item" v-on:click.prevent="$emit('show-list-migrator')">
            <i class="fas fa-plane fa-fw mr-2"></i>
            <span>Move active to-dos</span>
          </a>
          <a href="#" class="dropdown-item" v-on:click.prevent="changeListState('Completed')">
            <i class="fas fa-check fa-fw mr-2"></i>
            <span>Mark as completed</span>
          </a>
          <a href="#" class="dropdown-item" v-on:click.prevent="deleteList">
            <i class="fas fa-trash-alt fa-fw mr-2"></i>
            <span>Delete list</span>
          </a>
        </div>
      </div>
    </div>
    <invisible-input
      class="d-block lead"
      :text="description"
      v-on:updated="saveDescription"
      class-list="text-white mb-2"
      placeholder="Describe why this list is important..."
    />

    <span v-if="isListCompleted" class="badge badge-success p-2">
      <i class="fas fa-check fa-fw mr-2"/>List completed
    </span>

    <div class="list-progress progress">
      <div
        class="progress-bar progress-bar-striped complete-popover"
        role="progressbar"
        style="width: 100%"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
        v-bind:style="'width: ' + progressValue + '%;'"
        data-toggle="popover"
        data-placement="bottom"
      ></div>
      <div style="display: none">
        <div id="complete-popover-content">
          <button class="btn btn-primary mr-2" v-on:click.prevent="changeListState('Completed')">
            <i class="fas fa-check fa-fw mr-2"/>
            <span>Complete</span>
          </button>
          <button class="btn btn-secondary" onclick="window.$('.complete-popover').popover('hide')">
            <i class="fas fa-times fa-fw mr-2"/>
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  </page-header>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    state: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageSource: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      progressValue: 0
    };
  },
  mounted() {
    this.$root.$on("list-count-refresh", progressValue => {
      this.progressValue = progressValue;
      window.$(".complete-popover").popover("hide");

      if (progressValue === 100 && this.isListActive) {
        window.$(".complete-popover").popover({
          html: true,
          content: window.$("#complete-popover-content")
        });
        setTimeout(function() {
          window.$(".complete-popover").popover("show");
        }, 1000);
      }
    });
  },
  beforeDestroy() {
    this.$root.$off("list-count-refresh");
  },
  computed: {
    isListActive() {
      return this.state === 1;
    },
    isListCompleted() {
      return this.state === 3;
    }
  },
  methods: {
    deleteList() {
      Promise.all([
        this.$http.delete(`/lists/${this.id}`),
        this.$http.delete(`/lists/${this.id}/todoItems`)
      ]).then(() => {
        this.$root.$emit("refresh-lists");
        this.$root.$emit("load-default-list");
      });
    },
    changeListState(state) {
      window.$(".complete-popover").popover("hide");

      this.$http
        .put(`/lists/${this.id}/state`, {
          state: state
        })
        .then(() => {
          this.$root.$emit("refresh-lists");

          if (state === "Completed") {
            this.$root.$emit("load-default-list");
          }
        });
    },
    saveName(newValue) {
      this.$http
        .put(`/lists/${this.id}/name`, {
          name: newValue
        })
        .then(() => {
          this.$root.$emit("refresh-lists");
        });
    },
    saveDescription(newValue) {
      this.$http.put(`/lists/${this.id}/description`, {
        description: newValue
      });
    }
  }
};
</script>

<style>
.list-dropdown {
  border-color: #db5461 !important;
  color: #db5461 !important;
}

.list-dropdown:hover {
  border-color: #e5b25d !important;
  color: #e5b25d !important;
}

.list-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 20px;
  opacity: 0.5;
  background-color: transparent;
  border-radius: 0 !important;
}

.list-progress .progress-bar {
  width: 0;
  transition: width 0.6s ease-in-out;
  background-color: #c0ea67 !important;
}
</style>