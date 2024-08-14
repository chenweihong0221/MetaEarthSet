import * as mars3d from "mars3d"
import { Cesium } from "mars3d"

export class Human {
  id: string
  model: mars3d.graphic.ModelEntity
  layer: mars3d.layer.GraphicLayer
  positions: Cesium.Cartesian3
  show: boolean = true

  constructor(id: string, position: Cesium.Cartesian3, layer: mars3d.layer.GraphicLayer) {
    this.id = id
    this.positions = position
    this.model = new mars3d.graphic.ModelEntity({
      position: position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/man/walk.gltf",
        scale: 1,
        minimumPixelSize: 50
      }
    })
    this.layer = layer
    this.layer.addGraphic(this.model)
    console.log("human added to layer", this.model)
  }
}
