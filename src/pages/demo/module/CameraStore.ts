import { createStore } from "vuex"

const cameraDrawStore = createStore({
  state: {
    cameraDraw: false
  },
  mutations: {
    toggleCameraDraw (state) {
      state.cameraDraw = !state.cameraDraw
    }
  },
  actions: {
  }
})

export default cameraDrawStore
