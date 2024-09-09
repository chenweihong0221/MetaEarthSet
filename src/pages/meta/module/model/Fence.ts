import * as mars3d from "mars3d"
import { Cesium, LngLatPoint } from "mars3d"
import { mapStore, stateStore } from "@mars/pages/meta/module/store/store"
import { GraphicInterface } from "@mars/pages/meta/module/model/GraphicInterface"
import { castTo2DArr, convertToJSON, LngLatPointToJSON } from "@mars/pages/meta/module/tool/position"
import { ModelData } from "@mars/pages/meta/api/adopter"
import { addModel } from "@mars/pages/meta/api/api"
import { message } from "ant-design-vue"

export class Fence implements GraphicInterface {
  id: string
  code: string
  polygon: mars3d.graphic.ScrollWall
  height: number
  name: string
  positions: Cesium.Cartesian3[]
  show: boolean = true // 是否显示

  constructor(positions: Cesium.Cartesian3[] | LngLatPoint[], name?: string, height?: number, id?: string, api?: boolean) {
    this.height = height || 5
    this.name = name || "围栏"
    if (positions[0] instanceof mars3d.Cesium.Cartesian3) {
      this.positions = positions as Cesium.Cartesian3[]
    } else {
      this.positions = (positions as { x: number; y: number; z: number }[]).map((item) => {
        return Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)
      })
    }
    this.id = id || this.polygon.id.toString()
    if (api) {
      const model = this.toModelData(stateStore.state.selectedAreaCode)
      addModel(model).then((res) => {
        // eslint-disable-next-line
        if (res.data.code === "0") {
          this.id = res.data.data.districtId
          this.code = res.data.data.districtCode
          message.success("新增围栏成功")
          mapStore.commit("addFence", this)
          stateStore.commit("updateLeftBarNeedUpdate", true)
        } else {
          message.error(res.data.msg)
        }
      })
    }
    this.polygon = new mars3d.graphic.ScrollWall({
      positions,
      name: name || "围栏",
      style: {
        diffHeight: this.height,
        color: "#d75ee1",
        opacity: 0.8
      }
    })
    // mapStore.state.graphicLayer.addGraphic(this.polygon)
    window.drawGraphicLayer.addGraphic(this.polygon)
    window.polygonWall.set(this.id, this.polygon)
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

  toJSONObject(): any {
    return {
      id: this.id,
      name: this.name,
      height: this.height,
      positions: this.polygon.positions
    }
  }

  static fromJSONObject(json: any, layer: mars3d.layer.GraphicLayer): Fence {
    const positions = json.positions
    const height = json.height
    const name = json.name
    return new Fence(positions, name, height, json.id)
  }

  toModelData(areaId?: string): ModelData {
    if (areaId == null) {
      throw new Error("areaId is null")
    }
    const pos = castTo2DArr(this.positions)
    const position = mars3d.PolyUtil.centerOfMass(this.positions)
    const path = convertToJSON(pos)
    const lngLatPoint = this.positions.map((position) => mars3d.LngLatPoint.fromCartesian(position))
    const lngLatPointPath = LngLatPointToJSON(lngLatPoint)
    return new ModelData(areaId, this.id, this.name, path, lngLatPointPath, position, 8, null)
  }
}
