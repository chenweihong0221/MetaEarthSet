import * as mars3d from "mars3d"


export class Camera {
  id: string
  graphic: mars3d.graphic.DivGraphic
  layer: mars3d.layer.GraphicLayer

  show: boolean = true // 是否显示

  constructor(id: string, graphic: mars3d.graphic.DivGraphic, layer: mars3d.layer.GraphicLayer) {
    this.graphic = graphic
    this.id = id
    this.layer = layer
    this.layer.addGraphic(this.graphic)
  }
}
