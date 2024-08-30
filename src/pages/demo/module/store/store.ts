import { Building, Floor, Space } from "@mars/pages/demo/module/model/Building"
import { Camera } from "@mars/pages/demo/module/model/Camera"
import { Fence } from "@mars/pages/demo/module/model/Fence"
import { GraphicDraw } from "@mars/pages/demo/module/model/GraphicDraw"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { Human } from "@mars/pages/demo/module/model/Human"
import { OpenAir } from "@mars/pages/demo/module/model/OpenAir"
import * as mars3d from "mars3d"
import { Cesium } from "mars3d"
import { createStore } from "vuex"

export const mapStore = createStore({
  state() {
    return {
      map: null,
      buildingMap: new Map<string, Building>(), // buildingId => Building
      floorBuildingMap: new Map<string, string>(), // floorId => buildingId
      spaceFloorMap: new Map<string, string>(), // spaceId => floorId
      fenceMap: new Map<string, Fence>(),
      graphicDrawMap: new Map<string, GraphicDraw>(),
      cameraMap: new Map<string, Camera>(),
      humanMap: new Map<string, Human>(),
      openAirMap: new Map<string, OpenAir>(), // openAirId => OpenAir
      graphicLayer: null, // graphicLayer
      graphicLayer2d: null, // graphicLayer2d
      outlineEffect: null, // 高亮效果
      districtCode: null // 区域编码
    }
  },
  mutations: {
    addBuilding(state, building: Building) {
      state.buildingMap.set(building.id, building)
      // for (const floor of building.floors.values()) {
      //   state.floorBuildingMap.set(floor.id.toString(), building.id)
      //   for (const space of floor.spaces.values()) {
      //     state.spaceFloorMap.set(space.id.toString(), floor.id.toString())
      //   }
      // }
    },
    addFence(state, fence: Fence) {
      state.fenceMap.set(fence.id.toString(), fence)
    },
    addOpenAir(state, openAir: OpenAir) {
      state.openAirMap.set(openAir.id, openAir)
    },
    addHuman(state, human: Human) {
      state.humanMap.set(human.id.toString(), human)
    },
    addGraphicDraw(state, graphicDraw: GraphicDraw) {
      state.graphicDrawMap.set(graphicDraw.id.toString(), graphicDraw)
    },
    addCamera(state, camera: Camera) {
      state.cameraMap.set(camera.id.toString(), camera)
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
      if (space.polygon) {
        space.polygon.destroy()
      }
      if (space.wall) {
        space.wall.destroy()
      }
    },
    removeFence(state, id: string) {
      const fence = state.fenceMap.get(id)
      state.fenceMap.delete(id)
      fence.polygon.destroy()
    },
    removeOpenAir(state, id: string) {
      const openAir = state.openAirMap.get(id)
      state.openAirMap.delete(id)
      if (openAir.polygon) {
        openAir.polygon.destroy()
      }
      if (openAir.wall) {
        openAir.wall.destroy()
      }
    },
    removeGraphicDraw(state, id: string) {
      const graphicDraw = state.graphicDrawMap.get(id)
      state.graphicDrawMap.delete(id)
      graphicDraw.graphic.destroy()
    },
    removeHuman(state, id: string) {
      const human = state.humanMap.get(id)
      state.humanMap.delete(id)
      human.model.destroy()
    },
    removeCamera(state, id: string) {
      const camera = state.cameraMap.get(id)
      state.cameraMap.delete(id)
      camera.graphic.destroy()
    },
    setMap(state, map) {
      state.map = map
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
    },
    setOutlineEffect(state, effect) {
      state.outlineEffect = effect
    },
    clearMap(state) {
      state.buildingMap.clear()
      state.floorBuildingMap.clear()
      state.spaceFloorMap.clear()
      state.fenceMap.clear()
      state.openAirMap.clear()
      state.graphicDrawMap.clear()
      state.humanMap.clear()
      state.cameraMap.clear()
    }
  },
  getters: {
    getGraphicByIdAndType: state => (id: string, type: number): GraphicInterface => {
      switch (type) {
        case 0:
          return state.buildingMap.get(id)
        case 1: {
          console.log("id", id)
          console.log("building exist", state.floorBuildingMap.get(id), state.floorBuildingMap)
          console.log("floor exist", state.buildingMap.get(state.floorBuildingMap.get(id)).floors.has(id))
          return state.buildingMap.get(state.floorBuildingMap.get(id)).floors.get(id)
        }
        case 2: {
          console.log("id", id)
          console.log("building exist", state.floorBuildingMap.get(state.spaceFloorMap.get(id)))

          return state.buildingMap.get(state.floorBuildingMap.get(state.spaceFloorMap.get(id))).floors.get(state.spaceFloorMap.get(id)).spaces.get(id)
        }

        case 3:
          return state.fenceMap.get(id)
        case 4:
          return state.openAirMap.get(id)
        case 5:
          return state.graphicDrawMap.get(id)
        case 6:
          return state.humanMap.get(id)
        case 7:
          return state.cameraMap.get(id)
        default:
          return null
      }
    },
    getBuildingById: state => (id: string): Building => {
      return state.buildingMap.get(id)
    },
    getBuildingByFloorId: state => (id: string): Building => {
      return state.buildingMap.get(state.floorBuildingMap.get(id))
    },
    getFloorByFloorId: state => (floorId: string): Floor => {
      const buildingId = state.floorBuildingMap.get(floorId)
      const building = state.buildingMap.get(buildingId)
      return building.floors.get(floorId)
    },
    getSpaceBySpaceId: state => (spaceId: string): Space => {
      const floorId = state.spaceFloorMap.get(spaceId)
      const building = state.buildingMap.get(state.floorBuildingMap.get(floorId))
      const floor = building.floors.get(floorId)
      return floor.spaces.get(spaceId)
    },
    getFenceByFenceId: state => (fenceId: string): Fence => {
      return state.fenceMap.get(fenceId)
    },
    getOpenAirByOpenAirId: state => (id: string): OpenAir => {
      return state.openAirMap.get(id)
    },
    getGraphicDrawByGraphicDrawId: state => (id: string): GraphicDraw => {
      return state.graphicDrawMap.get(id)
    },
    getFencePositions: state => () => {
      return Array.from(state.fenceMap.values()).map(fence => {
        return fence.polygon.positions
      })
    },
    getHumanByHumanId: state => (id: string): Human => {
      return state.humanMap.get(id)
    },
    getCameraByCameraId: state => (id: string): Camera => {
      return state.cameraMap.get(id)
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
      selectedGraphicType: 0, // 0未选中，1楼层，2空间，3围栏，4露天场所
      leftBarNeedUpdate: false,
      selectedAreaCode: "",
      selectedAreaId: ""
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
    },
    updateLeftBarNeedUpdate(state, leftBarNeedUpdate: boolean) {
      state.leftBarNeedUpdate = leftBarNeedUpdate
    },
    updateSelectedAreaCode(state, data: string) {
      state.selectedAreaCode = data
    },
    updateSelectedAreaId(state, data: string) {
      state.selectedAreaId = data
    }
  }
})

export const stateKey = Symbol("stateKey")
