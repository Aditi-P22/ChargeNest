<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import axios from "axios";

const body = document.getElementsByTagName("body")[0];
const store = useStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

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

const API_BASE_URL = "http://localhost:8000/api"; // Change to your API base URL

const handleSignin = async () => {
  if (!email.value || !password.value) {
    alert("Please enter email and password.");
    return;
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
      alert("Login successful!");
      // Save token, user info, or handle rememberMe here if needed
      router.push("/Home-Page"); // Redirect after successful login
    } else {
      alert(response.data.message || "Signin failed.");
    }
  } catch (error) {
    console.error("Signin error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      alert(error.response.data.message || "Signin failed with server error.");
    } else if (error.request) {
      console.error("Request made but no response received:", error.request);
      alert("No response from server. Please check your backend.");
    } else {
      console.error("Error setting up request:", error.message);
      alert("An unexpected error occurred during signin.");
    }
  }
};
</script>

<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="handleSignin">
                    <div class="mb-3">
                      <argon-input
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        size="lg"
                        v-model="email"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        size="lg"
                        v-model="password"
                      />
                    </div>
                    <argon-switch
                      id="rememberMe"
                      name="remember-me"
                      v-model="rememberMe"
                    >
                      Remember me
                    </argon-switch>

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        type="submit"
                      >
                        Sign in
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="/signup"
                      class="text-success text-gradient font-weight-bold"
                      >Sign up</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://media.istockphoto.com/id/1564615208/photo/ev-charging-stations-or-electric-vehicle-recharging-stations-with-graphic-display.jpg?s=612x612&w=0&k=20&c=Q0abYEWywvzsbtNIqDeGZfQNkH9kXmVhvQAQkqQS43w=&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Powering your journey forward"
                </h4>
                <p class="text-white position-relative">
                  Reliable and fast charging stations wherever you go — making
                  every mile count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
