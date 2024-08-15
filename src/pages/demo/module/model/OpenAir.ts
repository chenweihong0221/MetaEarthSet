import { Cesium } from "mars3d"
import * as mars3d from "mars3d"
import * as uuid from "uuid"
import { mapStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"

export class OpenAir implements GraphicInterface {
  id: string
  name: string
  positions: Cesium.Cartesian3[]
  height: number
  layer: mars3d.layer.GraphicLayer
  polygon: mars3d.graphic.PolygonEntity
  wall: mars3d.graphic.ThickWall

  show: boolean = true // 是否显示

  constructor(layer: mars3d.layer.GraphicLayer, positions: Cesium.Cartesian3[], name?: string, height?: number) {
    this.id = uuid.v4()
    this.positions = positions
    this.name = name || "露天场所"
    this.height = height || 5
    this.layer = layer
    this.polygon = new mars3d.graphic.PolygonEntity({
      positions,
      name: name || "露天场所",
      style: {
        // color: "#be3aea",
        color: "#CECECE",
        opacity: 1
      }
    })
    this.wall = new mars3d.graphic.ThickWall({
      positions,
      name: name || "露天场所",
      style: {
        // color: "#be3aea",
        color: "#A9A9A9", // modify by cwh 202408081127
        opacity: 1,
        diffHeight: this.height,
        width: 0.1,
        closure: true
      }
    })
    this.layer.addGraphic(this.polygon)
    this.layer.addGraphic(this.wall)
  }

  setShow(show: boolean): void {
    this.show = show
    this.polygon.show = show
    this.wall.show = show
  }

  highLight(): void {
    this.polygon.setOptions({
      style: {
        color: "#FFFF00"
      }
    })
    this.wall.setOptions({
      style: {
        color: "#FFFF00"
      }
    })
  }

  removeHighLight(): void {
    this.polygon.setOptions({
      style: {
        color: "#CECECE"
      }
    })
    this.wall.setOptions({
      style: {
        color: "#A9A9A9"
      }
    })
  }

  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.polygon)
  }
}
