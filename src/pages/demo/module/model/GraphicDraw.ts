import * as mars3d from "mars3d"
import { mapStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"

export class GraphicDraw implements GraphicInterface {
  id: string
  name: string
  graphic: mars3d.graphic.DivGraphic

  show: boolean = true // 是否显示

  constructor(name:string, graphic: mars3d.graphic.DivGraphic) {
    this.graphic = graphic
    this.name = name
    this.id = graphic.id.toString()
  }

  setShow(show: boolean): void {
    this.show = show
    this.graphic.show = show
  }

  highLight(): void {
    this.graphic.setOptions({
      style: {
        color: "#FFFF00"
      }
    })
  }

  removeHighLight(): void {
    this.graphic.setOptions({
      style: {
        color: "#FFFFFF"
      }
    })
  }

  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.graphic)
  }
}
