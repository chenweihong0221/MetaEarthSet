import { Cesium } from "mars3d"
import * as mars3d from "mars3d"
import * as uuid from "uuid"

export class OpenAir {
  id: string
  name: string
  positions: Cesium.Cartesian3[]
  height: number
  layer: mars3d.layer.GraphicLayer
  polygon: mars3d.graphic.PolygonEntity
  wall: mars3d.graphic.ThickWall

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
}
