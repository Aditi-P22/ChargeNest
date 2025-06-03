<script setup>
import CategoriesList from "./components/CategoriesList.vue";
import ChargingStationMap from "./components/ChargingStationMap.vue";
import axios from "axios";
//import GradientLineChart from "@/examples/Charts/GradientLineChart.vue"; // Keep this commented or remove if not used
//import Carousel from "./components/Carousel.vue";

import { ref, computed, onMounted } from "vue";

const allStations = ref([]);
const activeFilters = ref({});

const fetchAllStations = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/charging-stations"
    );
    allStations.value = response.data;
  } catch (error) {
    console.error("Failed to fetch all charging stations:", error);
  }
};

onMounted(fetchAllStations);

const filteredStations = computed(() => {
  let stationsToFilter = [...allStations.value];

  for (const filterKey in activeFilters.value) {
    const filterValue = activeFilters.value[filterKey];

    if (filterValue === null) {
      continue;
    }

    switch (filterKey) {
      case "connectorType":
        stationsToFilter = stationsToFilter.filter(
          (station) => station.connectorType === filterValue
        );
        break;
      case "powerOutput":
        stationsToFilter = stationsToFilter.filter(
          (station) => station.powerOutput === filterValue
        );
        break;
      case "status":
        stationsToFilter = stationsToFilter.filter(
          (station) =>
            station.status.toLowerCase() === filterValue.toLowerCase()
        );
        break;
      default:
        break;
    }
  }

  return stationsToFilter;
});

const handleFilterApplied = ({ key, value }) => {
  if (activeFilters.value[key] === value) {
    activeFilters.value[key] = null;
  } else {
    activeFilters.value[key] = value;
  }
};

const clearAllFilters = () => {
  activeFilters.value = {};
};
</script>
<template>
  <div class="row">
    <div class="col-lg-7 mb-lg">
      <charging-station-map :stations="filteredStations" />
    </div>
    <div class="col-lg-5">
      <categories-list
        :categories="[
          {
            icon: {
              component: 'ni ni-mobile-button',
              background: 'dark',
            },
            label: 'Connector Type',
            description: 'Select connector type',
            type: 'dropdown',
            options: ['Type2', 'CHAdeMO', 'CCS'],
            filterKey: 'connectorType',
          },
          {
            icon: { component: 'ni ni-tag', background: 'dark' },
            label: 'Power Output',
            description: 'Select power output',
            type: 'dropdown',
            options: [60, 120, 100],
            filterKey: 'powerOutput',
          },
          {
            icon: { component: 'ni ni-box-2', background: 'dark' },
            label: 'Status',
            description: 'Select status',
            type: 'dropdown',
            options: ['Active', 'Inactive'],
            filterKey: 'status',
          },
        ]"
        @filter-applied="handleFilterApplied"
      />
      <div class="text-center mt-3">
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="clearAllFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>
