import { createStore } from "vuex"
import { Building, Fence, Floor, GraphicDraw, OpenAir, Space } from "@mars/pages/demo/module/Building"
import * as mars3d from "mars3d"
import { Cesium } from "mars3d"

export const mapStore = createStore({
  state() {
    return {
      map: null,
      buildingMap: new Map<string, Building>(), // buildingId => Building
      floorBuildingMap: new Map<string, string>(), // floorId => buildingId
      spaceFloorMap: new Map<string, string>(), // spaceId => floorId
      fenceMap: new Map<string, Fence>(),
      graphicDrawMap: new Map<string, GraphicDraw>(),
      cameraMap: new Map<string, mars3d.graphic.DivGraphic>(),
      openAirMap: new Map<string, OpenAir>(), // openAirId => OpenAir
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
    addOpenAir(state, openAir: OpenAir) {
      state.openAirMap.set(openAir.id.toString(), openAir)
      state.graphicLayer.addGraphic(openAir.polygon)
    },
    removeBuilding(state, id: string) {
      const building = state.buildingMap.get(id)
      state.buildingMap.delete(id)
      for (const floor of building.floors.values()) {
        for (const space of floor.spaces.values()) {
          const s = floor.spaces.get(space.id.toString())
          state.spaceFloorMap.delete(space.id.toString())
          s.polygon.destroy()
          s.wall.destroy()
        }
        const f = building.floors.get(floor.id.toString())
        state.floorBuildingMap.delete(floor.id.toString())
        f.polygon.destroy()
        f.wall.destroy()
      }
      state.buildingMap.delete(id)
    },
    removeFloor(state, id: string) {
      const building = state.buildingMap.get(state.floorBuildingMap.get(id))
      const floor = state.buildingMap.get(state.floorBuildingMap.get(id)).floors.get(id)
      for (const space of floor.spaces.values()) {
        const s = floor.spaces.get(space.id.toString())
        state.spaceFloorMap.delete(space.id.toString())
        s.polygon.destroy()
        s.wall.destroy()
      }
      state.floorBuildingMap.delete(id)
      building.floors.delete(id)
      floor.polygon.destroy()
      floor.wall.destroy()
    },
    removeSpace(state, id: string) {
      const space = state.buildingMap.get(state.floorBuildingMap.get(state.spaceFloorMap.get(id))).floors.get(state.spaceFloorMap.get(id)).spaces.get(id)
      const floor = state.buildingMap.get(state.floorBuildingMap.get(state.spaceFloorMap.get(id))).floors.get(state.spaceFloorMap.get(id))
      floor.spaces.delete(id)
      state.spaceFloorMap.delete(id)
      space.polygon.destroy()
      space.wall.destroy()
    },
    removeFence(state, id: string) {
      const fence = state.fenceMap.get(id)
      state.fenceMap.delete(id)
      fence.polygon.destroy()
    },
    removeOpenAir(state, id: string) {
      const openAir = state.openAirMap.get(id)
      state.openAirMap.delete(id)
      openAir.polygon.destroy()
      openAir.wall.destroy()
    },
    removeGraphicDraw(state, id: string) {
      const graphicDraw = state.graphicDrawMap.get(id)
      state.graphicDrawMap.delete(id)
      graphicDraw.graphic.destroy()
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
    getBuildingById: state => (id: string): Building => {
      return state.buildingMap.get(id)
    },
    getBuildingByFloorId: state => (id: string): Building => {
      return state.buildingMap.get(state.floorBuildingMap.get(id))
    },
    getFloorByFloorId: state => (floorId: string): Floor => {
      const buildingId = state.floorBuildingMap.get(floorId)
      const building = state.buildingMap.get(buildingId)
      console.log("building", building)
      return building.floors.get(floorId)
    },
    getSpaceBySpaceId: state => (spaceId: string): Space => {
      const floorId = state.spaceFloorMap.get(spaceId)
      const building = state.buildingMap.get(state.floorBuildingMap.get(floorId))
      console.log("building", building)
      const floor = building.floors.get(floorId)
      console.log("floor", floor)
      return floor.spaces.get(spaceId)
    },
    getFenceByFenceId: state => (fenceId: string): Fence => {
      return state.fenceMap.get(fenceId)
    },
    getOpenAirByOpenAirId: state => (id: string): OpenAir => {
      return state.openAirMap.get(id)
    },
    getGraphicDrawByGraphicDrawId: state => (id: string):GraphicDraw => {
      return state.graphicDrawMap.get(id)
    },
    getFencePositions: state => () => {
      return Array.from(state.fenceMap.values()).map(fence => {
        return fence.polygon.positions
      })
    },
    isPositionInFence: state => (position: Cesium.Cartesian3): boolean => {
      for (const fence of state.fenceMap.values()) {
        if (mars3d.PolyUtil.isInPoly(position, fence.polygon.positions)) {
          return true
        }
      }
      return false
    }
  }
})
export const mapKey = Symbol("mapKey")

export const stateStore = createStore({
  state() {
    return {
      topBarState: "1",
      selectedGraphicId: "",
      selectedGraphicType: 0 // 0未选中，1楼层，2空间，3围栏，4露天场所
    }
  },
  mutations: {
    updateTopBarState(state, topBarState) {
      state.topBarState = topBarState
    },
    updateSelectedGraphicId(state, selectedGraphicId: string) {
      state.selectedGraphicId = selectedGraphicId
    },
    updateSelectedGraphicType(state, selectedGraphicType: number) {
      state.selectedGraphicType = selectedGraphicType
    }

  }
})

export const stateKey = Symbol("stateKey")
