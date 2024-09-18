import { ModelData } from "@mars/pages/meta/api/adopter"

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
