<script setup>
import { ref } from "vue"; // Remove onMounted and watch as they are no longer used
import axios from "axios";

const props = defineProps({
  stations: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["station-updated", "station-deleted"]);

const editingStation = ref(null);

const deleteStation = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/api/charging-stations/${id}`);
    emit("station-deleted");
  } catch (error) {
    console.error("Failed to delete charging station:", error);
  }
};

const openEditModal = (station) => {
  editingStation.value = JSON.parse(JSON.stringify(station)); // deep copy
};

const updateStation = async () => {
  try {
    const { _id, ...data } = editingStation.value;
    await axios.put(`http://localhost:8000/api/charging-stations/${_id}`, data);
    emit("station-updated");
    editingStation.value = null;
  } catch (error) {
    console.error("Failed to update charging station:", error);
  }
};
</script>

<template>
  <div class="card">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Charging Stations</h6>
    </div>
    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <li
          v-for="station in props.stations"
          :key="station._id"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{ station.name }}</h6>
            <span class="mb-2 text-xs">
              Connector Type:
              <span class="text-dark font-weight-bold ms-sm-2">
                {{ station.connectorType }}
              </span>
            </span>
            <span class="mb-2 text-xs">
              Power Output:
              <span class="text-dark ms-sm-2 font-weight-bold">
                {{ station.powerOutput }} kW
              </span>
            </span>
            <span class="mb-2 text-xs">
              Status:
              <span class="text-dark ms-sm-2 font-weight-bold">
                {{ station.status }}
              </span>
            </span>
            <span class="text-xs">
              Location:
              <span class="text-dark ms-sm-2 font-weight-bold">
                Lat: {{ station.location.latitude }}, Lng:
                {{ station.location.longitude }}
              </span>
            </span>
          </div>
          <div class="ms-auto text-end">
            <a
              class="btn btn-link text-danger text-gradient px-3 mb-0"
              href="javascript:;"
              @click="deleteStation(station._id)"
            >
              <i class="far fa-trash-alt me-2" aria-hidden="true"></i>Delete
            </a>
            <a
              class="btn btn-link text-dark px-3 mb-0"
              href="javascript:;"
              @click="openEditModal(station)"
            >
              <i
                class="fas fa-pencil-alt text-dark me-2"
                aria-hidden="true"
              ></i>
              Edit
            </a>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="editingStation" class="modal-backdrop">
      <div class="modal-content p-4">
        <h5>Edit Charging Station</h5>
        <input
          v-model="editingStation.name"
          class="form-control mb-2"
          placeholder="Name"
        />
        <input
          v-model="editingStation.connectorType"
          class="form-control mb-2"
          placeholder="Connector Type"
        />
        <input
          v-model.number="editingStation.powerOutput"
          class="form-control mb-2"
          placeholder="Power Output"
        />
        <input
          v-model="editingStation.status"
          class="form-control mb-2"
          placeholder="Status"
        />
        <input
          v-model.number="editingStation.location.latitude"
          class="form-control mb-2"
          placeholder="Latitude"
        />
        <input
          v-model.number="editingStation.location.longitude"
          class="form-control mb-2"
          placeholder="Longitude"
        />
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-secondary" @click="editingStation = null">
            Cancel
          </button>
          <button class="btn btn-primary" @click="updateStation">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #e9ecef; /* Light gray, you can customize */
}

.bg-gray-100 {
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.bg-gray-100:hover {
  background-color: #e9ecef !important;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
