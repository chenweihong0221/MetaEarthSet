import { mapStore, stateStore } from "../store/store"
import { Building } from "@mars/pages/demo/module/model/Building"
import { Fence } from "@mars/pages/demo/module/model/Fence"
import { OpenAir } from "@mars/pages/demo/module/model/OpenAir"
import { Human } from "@mars/pages/demo/module/model/Human"
import { GraphicDraw } from "@mars/pages/demo/module/model/GraphicDraw"
import { Camera } from "@mars/pages/demo/module/model/Camera"


function saveToJSON(): string {
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
  return JSON.stringify(jsonObject)
}
export async function save() {
  const json = saveToJSON()
  console.log(json)
  localStorage.setItem("mars3d_data", json)

  // 创建 Blob 对象
  const blob = new Blob([json], { type: "application/json" })
  // 自定义写入资源
  try {
    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({ suggestedName: "data.json" })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      console.log("文件已成功写入")
    } else {
      throw new Error("浏览器不支持 File System Access API")
    }
  } catch (error) {
    console.error("写入文件失败:", error)
  }
}

export function loadFromLocalStorage(jsonObj: any) {
  const json = localStorage.getItem("mars3d_data")
  if (!json) {
    console.error("未找到本地存储数据")
    return
  }
  const jsonObject = JSON.parse(json)
  console.log("jsonObject", jsonObject)
  console.log("jsonObj", jsonObj)
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
  const fences = jsonObj.fences.map((fence) => Fence.fromJSONObject(fence, mapStore.state.graphicLayer))
  fences.forEach((fence) => {
    mapStore.state.fenceMap.set(fence.id, fence)
  })
  const openAirs = jsonObj.openAirs.map((openAir) => OpenAir.fromJSONObject(openAir, mapStore.state.graphicLayer))
  openAirs.forEach((openAir) => {
    mapStore.state.openAirMap.set(openAir.id, openAir)
  })
  const humans = jsonObj.humans.map((human) => Human.fromJSONObject(human, mapStore.state.graphicLayer))
  humans.forEach((human) => {
    mapStore.state.humanMap.set(human.id, human)
  })
  const graphicData = jsonObj.graphicDraws.map((graphicDraw) => GraphicDraw.fromJSONObject(graphicDraw))
  graphicData.forEach((graphicDraw) => {
    mapStore.state.graphicDrawMap.set(graphicDraw.id, graphicDraw)
  })
  const cameras = jsonObj.cameras.map((camera) => Camera.fromJSONObject(camera))
  cameras.forEach((camera) => {
    mapStore.state.cameraMap.set(camera.id, camera)
  })
  stateStore.commit("updateLeftBarNeedUpdate", true)
}

export function load() {

}
