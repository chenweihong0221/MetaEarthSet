import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHashHistory } from "vue-router"

const routes: RouteRecordRaw[] = [
  { name: "home", path: "/", component: () => import("./views/map.vue") }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
