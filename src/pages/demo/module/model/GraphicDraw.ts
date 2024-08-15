import * as mars3d from "mars3d"

export class GraphicDraw {
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
}
