import { createStore } from "vuex"

const graphicDrawStore = createStore({
  state: {
    temperatureDraw: false,
    value: "",
    contentValue: ""
  },
  mutations: {
    toggleTemperatureDraw (state) {
      state.temperatureDraw = !state.temperatureDraw
    },
    setValue (state, value) {
      state.value = value
    },
    setcontentValue (state, value) {
      state.contentValue = value
    }
  },
  actions: {}
})

export default graphicDrawStore
