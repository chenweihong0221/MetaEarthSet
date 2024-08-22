import { Building } from "@mars/pages/demo/module/model/Building"
import { stateStore } from "@mars/pages/demo/module/store/store"


const floorHeight = 5
const spaceHeight = 3
const fenceHeight = 5
const openAirHeight = 5


export interface Location {
  x: number
  y: number
  z: number
}

export class ModelData {
  parentCode: string
  code: string
  name: string
  // multiple positions for polygon(0~4type), single position for point(5~8type)
  path: number[][]
  /**
   * 0: building
   * 1: floor
   * 2: space
   * 3: fence
   * 4: openAir
   * 5: graphicDraw
   * 6: human
   * 7: camera
   * 8: selfDefinedModel
   */
  type: number
  districtType: number

  floorNumber: number | null

  // for camera, data is flvUrl
  // for selfDefinedModel, data is url of model
  data: string

  constructor(parentCode: string, code: string, name: string, path: number[][], type: number, floorNumber?:number, data?: string) {
    this.parentCode = parentCode
    this.code = code
    this.name = name
    this.path = path
    this.type = type
    this.districtType = type
    this.floorNumber = floorNumber
    this.data = data
  }
}


