import { createStore } from "vuex"
import { Building, Fence, Floor } from "@mars/pages/demo/module/Building"

export const mapStore = createStore({
  state() {
    return {
      map: null,
      buildingMap: new Map<string, Building>(), // buildingId => Building
      floorBuildingMap: new Map<string, string>(), // floorId => buildingId
      fenceMap: new Map<string, Fence>(),
      graphicLayer: null, // graphicLayer
      graphicLayer2d: null // graphicLayer2d
    }
  },
  mutations: {
    addBuilding(state, building: Building) {
      state.buildingMap.set(building.id, building)
      for (const floor of building.floors.values()) {
        state.floorBuildingMap.set(floor.id.toString(), building.id)
      }
    },
    addFence(state, fence: Fence) {
      state.fenceMap.set(fence.id.toString(), fence)
      state.graphicLayer.addGraphic(fence.polygon)
    },
    setMap(state, map) {
      state.map = map
    },
    setOnlyPickText(state, text) {
      state.graphicLayer.setOnlyPickText(text)
    },
    setGraphicLayer(state, layer) {
      state.graphicLayer = layer
    },
    setGraphicLayer2d(state, layer) {
      state.graphicLayer2d = layer
    },
    clearBuildingMap(state) {
      state.buildingMap.clear()
      state.floorBuildingMap.clear()
    },
    clearAllMap(state) {
      state.buildingMap.clear()
      state.floorBuildingMap.clear()
      state.fenceMap.clear()
    },
    clearFenceMap(state) {
      state.fenceMap.clear()
    },

    // add by cwh 202408081054
    flytoHome(state) {
      state.map.flyHome()
    }
  },
  getters: {
    getBuildingById: state => (id: string):Building => {
      return state.buildingMap.get(id)
    },
    getBuildingByFloorId: state => (id: string): Building => {
      return state.buildingMap.get(state.floorBuildingMap.get(id))
    },
    getFloorByFloorId: state => (floorId: string):Floor => {
      console.log("input floodId", floorId)
      const buildingId = state.floorBuildingMap.get(floorId)
      console.log("get buildingId from hash index", buildingId)
      const building = state.buildingMap.get(buildingId)
      console.log("get building from buildingMap", building)
      const floor = state.buildingMap.get(buildingId).floors.get(floorId)
      console.log("get floor from building", floor)
      return floor
    },
    getFencePositions: state => () => {
      return state.fenceMap.values().map(fence => {
        return fence.polygon.positions
      })
    }
  }
})
export const mapKey = Symbol("mapKey")

export const stateStore = createStore({
  state() {
    return {
      topBarState: "1",
      selectedGraphicId: ""
    }
  },
  mutations: {
    updateTopBarState(state, topBarState) {
      state.topBarState = topBarState
    },
    updateSelectedGraphicId(state, selectedGraphicId) {
      state.selectedGraphicId = selectedGraphicId
    }
  }
})

export const stateKey = Symbol("stateKey")
