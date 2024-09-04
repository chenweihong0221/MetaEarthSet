import { mapStore, stateStore } from "../store/store"
import { Building } from "@mars/pages/demo/module/model/Building"
import { Fence } from "@mars/pages/demo/module/model/Fence"
import { OpenAir } from "@mars/pages/demo/module/model/OpenAir"
import { Human } from "@mars/pages/demo/module/model/Human"
import { GraphicDraw } from "@mars/pages/demo/module/model/GraphicDraw"
import { Camera } from "@mars/pages/demo/module/model/Camera"
import { AreaData, AreaLocalStorage } from "@mars/pages/demo/module/model/Area"

function getNowAreaData(): AreaData {
  const buildingArr = Array.from(mapStore.state.buildingMap.values())
  const fenceArr = Array.from(mapStore.state.fenceMap.values())
  const openAirArr = Array.from(mapStore.state.openAirMap.values())
  const graphicDrawArr = Array.from(mapStore.state.graphicDrawMap.values())
  const humanArr = Array.from(mapStore.state.humanMap.values())
  const cameraArr = Array.from(mapStore.state.cameraMap.values())
  const jsonObject = {
    buildings: buildingArr.map((building) => building.toJSONObject()),
    fences: fenceArr.map((fence) => fence.toJSONObject()),
    graphicDraws: graphicDrawArr.map((graphicDraw) => graphicDraw.toJSONObject()),
    openAirs: openAirArr.map((openAir) => openAir.toJSONObject()),
    humans: humanArr.map((human) => human.toJSONObject()),
    cameras: cameraArr.map((camera) => camera.toJSONObject())
  }
  return new AreaData(jsonObject.buildings, jsonObject.fences, jsonObject.openAirs, jsonObject.graphicDraws, jsonObject.humans, jsonObject.cameras)
}

function saveToJSON(): string {
  return JSON.stringify(getNowAreaData())
}
export function save() {
  const json = saveToJSON()
  console.log(json)
  localStorage.setItem("mars3d_data", json)

  // // 创建 Blob 对象
  // const blob = new Blob([json], { type: "application/json" })
  // // 自定义写入资源
  // try {
  //   if ("showSaveFilePicker" in window) {
  //     const handle = await window.showSaveFilePicker({ suggestedName: "data.json" })
  //     const writable = await handle.createWritable()
  //     await writable.write(blob)
  //     await writable.close()
  //     console.log("文件已成功写入")
  //   } else {
  //     throw new Error("浏览器不支持 File System Access API")
  //   }
  // } catch (error) {
  //   console.error("写入文件失败:", error)
  // }
}

export function saveToLocalStorage(id: string) {
  const areaData = getNowAreaData()
  const localStorageData = localStorage.getItem(`#area_${id}`)
  if (localStorageData) {
    const areaLocalStorage = JSON.parse(localStorageData)
    areaLocalStorage.data = JSON.stringify(areaData)
    localStorage.setItem(`#area_${id}`, JSON.stringify(areaLocalStorage))
  } else {
    localStorage.setItem(`#area_${id}`, JSON.stringify(new AreaLocalStorage(id, "未命名", JSON.stringify(areaData))))
  }
  console.log("#area_" + id, localStorage.getItem(`#area_${id}`))
}

export function loadJSON(json: string): AreaData {
  const jsonObj = JSON.parse(json)
  console.log("loadJSON", jsonObj)
  const buildings = Building.fromJSONArray(jsonObj.buildings, mapStore.state.graphicLayer)
  buildings.forEach((building) => {
    console.log("building", building)
    mapStore.state.buildingMap.set(building.id, building)
    Array.from(building.floors.values()).forEach((floor) => {
      mapStore.state.floorBuildingMap.set(floor.id, building.id)
      Array.from(floor.spaces.values()).forEach((space) => {
        mapStore.state.spaceFloorMap.set(space.id, floor.id)
      })
    })
  })
  console.log("loadJson,", jsonObj)
  const fences = jsonObj.fences.map((fence :Fence) => Fence.fromJSONObject(fence, mapStore.state.graphicLayer))
  fences.forEach((fence :Fence) => {
    mapStore.state.fenceMap.set(fence.id, fence)
  })
  const openAirs = jsonObj.openAirs.map((openAir :OpenAir) => OpenAir.fromJSONObject(openAir, mapStore.state.graphicLayer))
  openAirs.forEach((openAir :OpenAir) => {
    mapStore.state.openAirMap.set(openAir.id, openAir)
  })
  const humans = jsonObj.humans.map((human: Human) => Human.fromJSONObject(human, mapStore.state.graphicLayer))
  humans.forEach((human: Human) => {
    mapStore.state.humanMap.set(human.id, human)
  })
  const graphicData = jsonObj.graphicDraws.map((graphicDraw: GraphicDraw) => GraphicDraw.fromJSONObject(graphicDraw))
  graphicData.forEach((graphicDraw: GraphicDraw) => {
    mapStore.state.graphicDrawMap.set(graphicDraw.id, graphicDraw)
  })
  const cameras = jsonObj.cameras.map((camera: Camera) => Camera.fromJSONObject(camera))
  cameras.forEach((camera: Camera) => {
    mapStore.state.cameraMap.set(camera.id, camera)
  })
  stateStore.commit("updateLeftBarNeedUpdate", true)
  return new AreaData(buildings, fences, openAirs, humans, graphicData, cameras)
}

export function loadFromLocalStorage() {
  const json = localStorage.getItem("mars3d_data")
  if (!json) {
    console.error("未找到本地存储数据")
    return
  }
  loadJSON(json)
}

