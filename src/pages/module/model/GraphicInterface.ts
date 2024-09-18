import { ModelData } from "@mars/pages/api/adopter"

export interface GraphicInterface{
  id: string
  name: string
  show: boolean

  setShow(show: boolean): void

  highLight(): void

  removeHighLight(): void

  flyTo(): void

  toModelData(areaId?: string): ModelData
}
