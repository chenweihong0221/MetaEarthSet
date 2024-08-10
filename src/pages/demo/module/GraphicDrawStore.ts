import { createStore } from "vuex"

const graphicDrawStore = createStore({
  state: {
    graphicDraw: false,
    selectedGraphicDrawStyle: 1,
    selectedGraphicDrawContent: ""
  },
  mutations: {
    toggleGraphicDraw (state) {
      state.graphicDraw = !state.graphicDraw
    },
    setSelectedGraphicDrawStyle (state, value) {
      state.selectedGraphicDrawStyle = value
    },
    setSelectedGraphicDrawContent (state, value) {
      state.selectedGraphicDrawContent = value
    }
  },
  actions: {}
})

export default graphicDrawStore
