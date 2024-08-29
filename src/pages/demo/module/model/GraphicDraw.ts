import * as mars3d from "mars3d"
import { mapStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { Cesium } from "mars3d"
import { ModelData } from "@mars/pages/demo/api/adopter"
import { castTo2DArr } from "@mars/pages/demo/module/tool/position"

// 导入全局样式
import "../../style/divGraphic.css"

export class GraphicDraw implements GraphicInterface {
  id: string
  name: string
  position: mars3d.Cesium.Cartesian3
  graphic: mars3d.graphic.DivGraphic

  show: boolean = true // 是否显示

  constructor(name:string, position: mars3d.Cesium.Cartesian3, p_type?: number, id?: string) {

    switch (p_type) {
      case 1:
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
        break
      case 2:
        this.graphic = new mars3d.graphic.DivGraphic({
          position,
          style: {
            html: `<div class="marsBlackPanel  animation-spaceInDown">
                    <div class="marsBlackPanel-text" style="">
                      ${name} <span class="temperature"></span> ℃
                    </div>
                  </div>`,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.CENTER
          }
        })
        break
        case 3:
          this.graphic = new mars3d.graphic.DivGraphic({
            position,
            style: {
              html: `<div class="marsBlueGradientPnl">
                  <div>${name}</div>
              </div>`,
              offsetY: -60,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
          })
          break
        case 4:
          // this.graphic = new mars3d.graphic.DivGraphic({
          this.graphic = new mars3d.graphic.DivUpLabel({
            position,
            style: {
              text: name,
              color: "#fff",
              font_size: 16,
              font_family: "微软雅黑",
              lineHeight: 50,
              circleSize: 8,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000) // 按视距距离显示
            }
          })
          break
        case 5:
          this.graphic = new mars3d.graphic.DivGraphic({
            position,
            style: {
              html: `<div class="mars-spot">
              <div class="mars-spot-board">
              <h5>${name}</h5>
              </div>
              <div class="mars-spot-line"></div>
              </div>`,
              offsetY: -60,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
          })
          break
    }

    this.id = id || this.graphic.id.toString()
    this.name = name
    this.position = position
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

  toModelData(areaId: string): ModelData {
    const pos = castTo2DArr(this.position)
    return new ModelData(areaId, this.id, this.name, pos, 1)
  }


}
