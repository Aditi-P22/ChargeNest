<template>
  <div
    class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start pt-5"
    style="z-index: 1050; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div
      class="card p-4 shadow-lg bg-white rounded"
      style="width: 90%; max-width: 600px"
    >
      <h5 class="mb-3">Add Charging Station</h5>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="form.name"
          placeholder="Name"
          required
          class="form-control mb-2"
        />

        <input
          v-model.number="form.location.latitude"
          type="number"
          step="any"
          min="-90"
          max="90"
          placeholder="Latitude (-90 to 90)"
          required
          class="form-control mb-2"
        />

        <input
          v-model.number="form.location.longitude"
          type="number"
          step="any"
          min="-180"
          max="180"
          placeholder="Longitude (-180 to 180)"
          required
          class="form-control mb-2"
        />

        <select v-model="form.powerOutput" required class="form-control mb-2">
          <option disabled value="">Power Output (kW)</option>
          <option value="60">60 kW</option>
          <option value="100">100 kW</option>
          <option value="120">120 kW</option>
        </select>

        <select v-model="form.connectorType" required class="form-control mb-2">
          <option disabled value="">Connector Type</option>
          <option value="Type2">Type2</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="CCS">CCS</option>
        </select>

        <select v-model="form.status" required class="form-control mb-3">
          <option disabled value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div class="d-flex justify-content-end">
          <button
            :disabled="loading"
            type="submit"
            class="btn btn-success me-2"
          >
            {{ loading ? "Submitting..." : "Submit" }}
          </button>
          <button @click.prevent="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";

const emit = defineEmits(["close"]);
const loading = ref(false);

const form = reactive({
  name: "",
  location: {
    latitude: null,
    longitude: null,
  },
  powerOutput: "",
  connectorType: "",
  status: "",
});

const handleSubmit = async () => {
  // Basic front-end validation
  if (
    form.location.latitude < -90 ||
    form.location.latitude > 90 ||
    form.location.longitude < -180 ||
    form.location.longitude > 180
  ) {
    alert("Please enter valid latitude and longitude values.");
    return;
  }

  if (form.powerOutput <= 0) {
    alert("Power Output must be a positive number.");
    return;
  }

  loading.value = true;
  try {
    await axios.post("http://localhost:8000/api/charging-stations", form);
    alert("Charging station added successfully!");

    // Reset form
    form.name = "";
    form.location.latitude = null;
    form.location.longitude = null;
    form.powerOutput = null;
    form.connectorType = "";
    form.status = "Active";

    emit("close");
  } catch (error) {
    console.error("Error adding charging station:", error);
    alert("Failed to add charging station.");
  } finally {
    loading.value = false;
  }
};
</script>
