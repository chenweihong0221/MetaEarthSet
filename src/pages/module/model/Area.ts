import { Building } from "@mars/pages/module/model/Building"
import { Fence } from "@mars/pages/module/model/Fence"
import { OpenAir } from "@mars/pages/module/model/OpenAir"
import { GraphicDraw } from "@mars/pages/module/model/GraphicDraw"
import { Human } from "@mars/pages/module/model/Human"
import { Camera } from "@mars/pages/module/model/Camera"
import * as uuid from "uuid"
import { loadJSON } from "@mars/pages/module/tool/persistence"

export class AreaData {
  buildings: Building[]
  fences: Fence[]
  openAirs: OpenAir[]
  graphicDraws: GraphicDraw[]
  humans: Human[]
  cameras: Camera[]

  constructor(buildings: Building[], fences: Fence[], openAirs: OpenAir[], graphicDraws: GraphicDraw[], humans: Human[], cameras: Camera[]) {
    this.buildings = buildings
    this.fences = fences
    this.openAirs = openAirs
    this.humans = humans
    this.graphicDraws = graphicDraws
    this.cameras = cameras
  }
}

export class Area {
  id: string
  name: string
  districtId: string
  data: AreaData
  code: string
  areaOptions: string
  parentCode: string
  parentName: string
  districtLevel: string
  districtType: string
  updateUserName: string
  updateTime: string
  longitudeAndLatitudeJson: string

  constructor(name: string, addLocalStorage: boolean = true) {
    this.name = name
    this.districtId = uuid.v4()
    this.data = new AreaData([], [], [], [], [], [])
    if (addLocalStorage) {
      localStorage.setItem(`#area_${this.districtId}`, JSON.stringify(new AreaLocalStorage(this.id, this.name, JSON.stringify(this.data))))
    }
  }

  static getFromJson(json: string): Area {
    const areaLocalStorage = JSON.parse(json)
    if (!areaLocalStorage) {
      return null
    }
    const area = new Area(areaLocalStorage.name, false)
    area.id = areaLocalStorage.id
    area.data = loadJSON(areaLocalStorage.data)
    return area
  }

  static getFromLocalStorage(id: string): Area {
    const localStorageDataJson = localStorage.getItem(`#area_${id}`)
    return localStorageDataJson ? Area.getFromJson(localStorageDataJson) : null
  }
}



export class AreaLocalStorage {
  id: string
  name: string
  data: string

  constructor(id: string, name: string, data: string) {
    this.id = id
    this.name = name
    this.data = data
  }
}

/**
 * <p>考虑到场景中的元素很多，因此一个场景对应一个localStorage</p>
 * <p>对于localStorage的key的命名，使用area_场景uuid，因此获取areaId的方法为key.substring(5) </p>
 */
export function getAllAreaIdAndName(): { id: string, name: string }[] {
  const keys = Object.keys(localStorage)
  // keys.filter((key) => key.startsWith("#area_")).forEach(key => localStorage.removeItem(key))
  return keys.filter((key) => key.startsWith("#area_")).map((key) => {
    console.log(key)
    const localStorageDataJson = localStorage.getItem(key)
    const localStorageData = JSON.parse(localStorageDataJson)
    return {
      id: localStorageData.id,
      name: localStorageData.name
    }
  })
}

