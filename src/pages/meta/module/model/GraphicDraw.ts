import * as mars3d from "mars3d"
import { mapStore, stateStore } from "@mars/pages/meta/module/store/store"
import { GraphicInterface } from "@mars/pages/meta/module/model/GraphicInterface"
import { Cesium } from "mars3d"
import { ModelData } from "@mars/pages/meta/api/adopter"
import { castTo2DArr, LngLatPointToJSON } from "@mars/pages/meta/module/tool/position"


import { addModel } from "@mars/pages/meta/api/api"
import { message } from "ant-design-vue"
import { useStore } from "vuex"
import * as uuid from "uuid"

// 导入全局样式
import "../../style/divGraphic.css"

export class GraphicDraw implements GraphicInterface {
  id: string
  name: string
  position: mars3d.Cesium.Cartesian3
  graphic: mars3d.graphic.DivGraphic
  content: string
  show: boolean = true // 是否显示

  constructor(name: string,
    content: string,
    position: mars3d.Cesium.Cartesian3,
    p_type?: number,
    id?: string,
    isCreate?: boolean) {
    if (content === "" || content === undefined || content === null) {
      this.content = name
    } else {
      this.content = content
    }
    this.id = id || uuid.v4()
    this.name = name
    this.position = position

    if (isCreate === true) { // 手动创建
      const postData = this.toModelData(stateStore.state.selectedAreaCode)
      addModel(postData).then((res) => {
        if (res.data.code === "0") {
          this.id = res.data.data.districtId
          // 新增模型
          this.makeGraphic(p_type, position)
        } else {
          message.error(res.data.msg)
        }
      })
    } else { // 通过服务端获取
      this.makeGraphic(p_type, position)
    }
    // this.id = id || this.graphic.id.toString()
    // this.name = name
    // this.position = position
    // mapStore.state.graphicLayer.addGraphic(this.graphic)
  }

  setShow(show: boolean): void {
    this.show = show
    this.graphic.show = show
  }

  highLight(): void {
    // mapStore.state.outlineEffect.selected = [this.graphic]
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

  makeGraphic(type: number, position: Cesium.Cartesian3) {
    switch (type) {
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
                            ${this.content}
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
                      ${this.content} <span class="temperature"></span>
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
                  <div>${this.content}</div>
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
              <h5>${this.content}</h5>
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
    window.drawGraphicLayer.addGraphic(this.graphic)
    window.divGraphic.set(this.id, this.graphic)
    window.polygonToParent.set(this.id, this)
    // mapStore.state.graphicDrawMap.set(this.id, this)
    stateStore.commit("updateLeftBarNeedUpdate", true)
  }

  toModelData(areaId: string): ModelData {
    if (areaId == null) {
      throw new Error("areaId is null")
    }
    const pos = castTo2DArr(this.position)
    const path = ""
    const lngLatPoint = mars3d.LngLatPoint.fromCartesian(this.position)
    const lngLatPointPath = LngLatPointToJSON(lngLatPoint)
    return new ModelData(areaId, this.id, this.name, path, lngLatPointPath, this.position, 10, null, this.content)
  }
}
