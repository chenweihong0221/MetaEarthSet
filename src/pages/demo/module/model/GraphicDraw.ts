import * as mars3d from "mars3d"

export class GraphicDraw {
  id: string
  name: string
  graphic: mars3d.graphic.DivGraphic

  constructor(name:string, graphic: mars3d.graphic.DivGraphic) {
    this.graphic = graphic
    this.name = name
    this.id = graphic.id.toString()
  }
}
