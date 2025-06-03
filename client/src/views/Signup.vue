<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { useRouter } from "vue-router";

import ArgonInput from "@/components/ArgonInput.vue";

import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];
const store = useStore();
const router = useRouter();

// Reactive data
const email = ref("");
const password = ref("");

// API Base URL (you should replace with env var in production)
const API_BASE_URL = "http://localhost:8000/api";

const handleSignup = async () => {
  if (email.value === "" || password.value === "") {
    alert("Email and Password are required.");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
      alert(response.data.message);
      router.push("/signin");
    } else {
      alert(response.data.message || "Signup failed.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("An unexpected error occurred during signup.");
    }
  }
};

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;

  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;

  body.classList.add("bg-gray-100");
});
</script>

<template>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url(&quot;https://img.freepik.com/premium-photo/charging-station-electric-car-dark-background-power-plant-green-technology-future-copy-space-3d-rendering-3d-illustration_99433-7490.jpg&quot;);
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container mt-0 pt-0">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2">Welcome!</h1>
            <p class="text-lead text-white">
              Use this form to create a new account in your project.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>Register</h5>
            </div>

            <div class="card-body">
              <form @submit.prevent="handleSignup">
                <div class="mb-3">
                  <ArgonInput
                    type="email"
                    placeholder="Email"
                    v-model="email"
                  />
                </div>
                <div class="mb-3">
                  <ArgonInput
                    type="password"
                    placeholder="Password"
                    v-model="password"
                  />
                </div>

                <div class="text-center">
                  <ArgonButton
                    class="my-4 mb-2"
                    fullWidth
                    color="dark"
                    type="submit"
                  >
                    Sign up
                  </ArgonButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
