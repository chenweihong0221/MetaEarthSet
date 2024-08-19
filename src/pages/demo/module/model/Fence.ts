import * as mars3d from "mars3d"
import { Cesium, LngLatPoint } from "mars3d"
import { mapStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"

export class Fence implements GraphicInterface {
  id: string
  polygon: mars3d.graphic.ScrollWall
  height: number
  name: string

  show: boolean = true // 是否显示

  constructor(positions: Cesium.Cartesian3[] | LngLatPoint[], name?: string, height?: number) {
    this.height = height || 5
    this.name = name || "围栏"
    this.polygon = new mars3d.graphic.ScrollWall({
      positions,
      name: name || "围栏",
      style: {
        diffHeight: this.height,
        color: "#d75ee1",
        opacity: 0.8
      }
    })
    this.id = this.polygon.id.toString()
  }

  setShow(show: boolean): void {
    this.show = show
    this.polygon.show = show
  }


  highLight(): void {
    mapStore.state.outlineEffect.selected = [this.polygon]
  }

  removeHighLight(): void {
    mapStore.state.outlineEffect.selected = []
  }


  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.polygon)
  }
}
