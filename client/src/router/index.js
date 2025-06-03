import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import Mapview from "../views/mapview.vue";

import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
  },
  {
    path: "/Home-Page",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/mapview",
    name: "Mapview",
    component: Mapview,
  },

  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
