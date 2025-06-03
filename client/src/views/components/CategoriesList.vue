<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

// Emits an event with the filter key and the selected value
const emit = defineEmits(["filter-applied"]);

defineProps({
  title: {
    type: String,
    default: "Filter by Categories",
  },
  categories: {
    type: Array,
    required: true,
    // Expected category structure:
    // {
    //   icon: { component: String, background: String },
    //   label: String, // e.g., "Connector Type", "Power Output", "Status"
    //   type: String, // 'dropdown' or 'info'
    //   options: Array, // For 'dropdown' type, e.g., ['Type2', 'CHAdeMO']
    //   filterKey: String, // The actual key in your station data, e.g., 'connectorType'
    //   description: String // Optional description
    // }
  },
});

const activeDropdown = ref(null); // Stores the label of the currently open dropdown

const toggleDropdown = (category) => {
  if (category.type === "dropdown") {
    activeDropdown.value =
      activeDropdown.value === category.label ? null : category.label;
  }
  // If it's an info type, you could still emit something or do nothing specific.
  // For now, we'll only emit for dropdown selections.
};

const selectFilterValue = (category, value) => {
  emit("filter-applied", { key: category.filterKey, value: value });
  activeDropdown.value = null; // Close the dropdown after selection
};
</script>

<template>
  <div class="card">
    <div class="p-3 pb-0 card-header">
      <h6 class="mb-0">{{ title }}</h6>
    </div>
    <div class="p-3 card-body">
      <ul :class="`list-group ${isRTL ? 'pe-0' : ''}`">
        <li
          v-for="(category, index) of categories"
          :key="index"
          :class="`mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg
          ${isRTL ? 'pe-0' : 'ps-0'}`"
          style="position: relative; flex-wrap: wrap"
        >
          <div
            class="d-flex align-items-center"
            @click="toggleDropdown(category)"
          >
            <div
              :class="`text-center shadow icon icon-shape icon-sm bg-gradient-${category.icon.background} ${
                isRTL ? 'ms-3' : 'me-3'
              }`"
            >
              <i
                :class="`${category.icon.component} text-white opacity-10`"
              ></i>
            </div>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-sm text-dark">{{ category.label }}</h6>
              <span class="text-xs" v-html="category.description"></span>
            </div>
          </div>
          <div class="d-flex">
            <button
              v-if="category.type === 'dropdown'"
              class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark icon-move-right"
              @click="toggleDropdown(category)"
            >
              <i
                :class="`ni ${activeDropdown === category.label ? 'ni-bold-down' : 'ni-bold-right'}`"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <ul
            v-if="
              activeDropdown === category.label &&
              category.options &&
              category.options.length > 0
            "
            :class="`list-group position-absolute bg-white shadow-sm pt-2 border-radius-lg z-index-100`"
            :style="`top: 100%; left: 0; width: 100%; margin-top: 5px;`"
          >
            <li
              v-for="(option, optIndex) in category.options"
              :key="optIndex"
              class="list-group-item border-0 p-2 cursor-pointer hover-bg-light"
              @click="selectFilterValue(category, option)"
            >
              {{ option }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.hover-bg-light:hover {
  background-color: #f8f9fa; /* Bootstrap's gray-100 */
}
.z-index-100 {
  z-index: 100;
}
</style>
