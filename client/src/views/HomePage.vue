<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
//import GradientLineChart from "@/examples/Charts/GradientLineChart.vue"; // Keep this commented or remove if not used
//import Carousel from "./components/Carousel.vue";
import CategoriesList from "./components/CategoriesList.vue";
import BillingCard from "./components/BillingCard.vue";
// import ChargingStationMap from "./components/ChargingStationMap.vue";
import AddChargingStationForm from "./components/AddChargingStationForm.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const showForm = ref(false);
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
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <div>
              <mini-statistics-card
                title="Add new"
                value="Station"
                :icon="{
                  component: 'fas fa-plus',
                  background: 'bg-gradient-primary',
                  shape: 'rounded-circle',
                }"
                class="cursor-pointer transition-transform transform hover:scale-105 shadow-lg hover-bg-change"
                @click="showForm = true"
              />

              <add-charging-station-form
                v-if="showForm"
                @close="showForm = false"
              />
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Total Stations"
              :value="allStations.length"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-info',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Fast Chargers"
              :value="allStations.filter((s) => s.powerOutput >= 100).length"
              :icon="{
                component: 'fas fa-bolt',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Active Stations"
              :value="allStations.filter((s) => s.status === 'Active').length"
              :icon="{
                component: 'ni ni-check-bold',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-md-7">
            <billing-card
              :stations="filteredStations"
              @station-updated="fetchAllStations"
              @station-deleted="fetchAllStations"
            />
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
      </div>
    </div>
  </div>
</template>
<style>
.hover-bg-change:hover {
  transform: scale(1.07);
  box-shadow: 0 12px 25px rgba(13, 110, 253, 0.6);
  transition: all 0.3s ease;
}
</style>
