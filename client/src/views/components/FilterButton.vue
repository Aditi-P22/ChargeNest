<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["filter-click"]);

function onClick() {
  emit("filter-click");
}
</script>

<template>
  <button class="btn btn-primary" @click="onClick">Filter</button>
</template>
