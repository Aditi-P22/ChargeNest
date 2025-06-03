<script setup>
import { onMounted, watch } from "vue"; // HIGHLIGHT: Removed 'ref' from here

const props = defineProps({
  id: {
    type: String,
    default: "charging-station-map",
  },
  height: {
    type: String,
    default: "500",
  },
  title: {
    type: String,
    default: "Charging Station Locations",
  },

  stations: {
    type: Array,
    required: true,
    default: () => [],
  },
});

let map = null;
let markers = [];

const initMap = () => {
  if (window.google && window.google.maps) {
    const defaultLocation = { lat: 22.1696, lng: 75.8946 };

    map = new window.google.maps.Map(document.getElementById(props.id), {
      center: defaultLocation,
      zoom: 12,
      mapId: "YOUR_GOOGLE_MAP_ID",
    });

    addMarkers(props.stations);
  } else {
    console.warn("Google Maps API not loaded yet. Retrying in 500ms...");
    setTimeout(initMap, 500);
  }
};

const addMarkers = (stations) => {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  if (!map) return;

  stations.forEach((station) => {
    if (
      station.location &&
      typeof station.location.latitude === "number" &&
      typeof station.location.longitude === "number"
    ) {
      const marker = new window.google.maps.Marker({
        position: {
          lat: station.location.latitude,
          lng: station.location.longitude,
        },
        map: map,
        title: station.name,
      });

      const infoWindowContent = `
        <div>
          <h6>${station.name}</h6>
          <p><strong>Connector:</strong> ${station.connectorType}</p>
          <p><strong>Power:</strong> ${station.powerOutput} kW</p>
          <p><strong>Status:</strong> ${station.status}</p>
          <p><strong>Location:</strong> Lat: ${station.location.latitude}, Lng: ${station.location.longitude}</p>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
        });
      });

      markers.push(marker);
    } else {
      console.warn("Invalid location data for station:", station);
    }
  });

  if (markers.length > 0) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((marker) => bounds.extend(marker.getPosition()));
    map.fitBounds(bounds);
  }
};

watch(
  () => props.stations,
  (newStations) => {
    if (map) {
      addMarkers(newStations);
    }
  },
  { deep: true, immediate: false }
);

onMounted(() => {
  initMap();
});
</script>

<template>
  <div class="card card-body mt-1">
    <div class="card-header" style="padding: 4px 12px">
      <h6>{{ props.title }}</h6>
    </div>
    <div class="p-0 card-body">
      <div class="map-container">
        <div
          :id="props.id"
          class="map-canvas"
          :style="{ height: props.height + 'px' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
}

.map-canvas {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #e0e0e0;
}
.card-header {
  padding-top: 8px; /* reduce top padding */
  padding-bottom: 4px; /* reduce bottom padding */
  margin-bottom: 0; /* already present, just in case */
}
</style>
