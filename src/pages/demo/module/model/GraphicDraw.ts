import * as mars3d from "mars3d"
import { mapStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { Cesium } from "mars3d"

export class GraphicDraw implements GraphicInterface {
  id: string
  name: string
  position: mars3d.Cesium.Cartesian3
  graphic: mars3d.graphic.DivGraphic

  show: boolean = true // 是否显示

  constructor(name:string, position: mars3d.Cesium.Cartesian3, id?: string) {
    this.graphic = new mars3d.graphic.DivGraphic({
      position,
      style: {
        html: `     <div class="mars3d-graphicDraw-content">
                      <img class="mars3d-graphicDraw-img"
                        src="/img/icon/textPnl.png"
                        alt="样式一"
                      >
                    </div>
                    <div class="mars3d-draw-content-wrapper">
                      <div class="draw-style-content"
                            style="font-size: 23px;display: flex;align-items: center;justify-content: center;"
                            >
                        ${name}
                      </div>
                    </div>
                  `,
        offsetX: -16,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
      }
    })
    this.id = id || this.graphic.id.toString()
    this.name = name
    mapStore.state.graphicLayer.addGraphic(this.graphic)
  }

  setShow(show: boolean): void {
    this.show = show
    this.graphic.show = show
  }

  highLight(): void {
    mapStore.state.outlineEffect.selected = [this.graphic]
  }

  removeHighLight(): void {
    mapStore.state.outlineEffect.selected = []
  }

  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.graphic)
  }

  toJSONObject(): any {
    return {
      id: this.id,
      name: this.name,
      position: this.position
    }
  }

  static fromJSONObject(json: any): GraphicDraw {
    return new GraphicDraw(json.name, json.position, json.id)
  }


}
