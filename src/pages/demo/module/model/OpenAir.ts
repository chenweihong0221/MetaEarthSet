import { Cesium } from "mars3d"
import * as mars3d from "mars3d"
import * as uuid from "uuid"
import { mapStore, stateStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { ModelData } from "@mars/pages/demo/api/adopter"
import { addModel } from "@mars/pages/demo/api/api"
import { castTo2DArr } from "@mars/pages/demo/module/tool/position"
import { message } from "ant-design-vue"

export class OpenAir implements GraphicInterface {
  id: string
  name: string
  positions: Cesium.Cartesian3[]
  height: number
  layer: mars3d.layer.GraphicLayer
  polygon: mars3d.graphic.PolygonEntity
  wall: mars3d.graphic.ThickWall

  show: boolean = true // 是否显示

  constructor(
    layer: mars3d.layer.GraphicLayer,
    positions: Cesium.Cartesian3[],
    name?: string,
    height?: number,
    id?: string,
    api?: boolean) {

    this.id = id || uuid.v4()
    this.positions = positions
    this.name = name || "露天场所"
    this.height = height || 5
    this.layer = layer
    if (api === true) {
      const model = this.toModelData(stateStore.state.selectedAreaId)
      addModel(model).then((res) => {
        this.id = res.data.data
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
        mapStore.commit("addOpenAir", this)
        stateStore.commit("updateLeftBarNeedUpdate", true)
        message.success(res.data.msg)
      })
    }
  }

  setShow(show: boolean): void {
    this.show = show
    this.polygon.show = show
    this.wall.show = show
  }

  highLight(): void {
    if (this.wall) {
      mapStore.state.outlineEffect.selected = [this.wall]
    }
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
      positions: this.positions
    }
  }

  static fromJSONObject(json: any, layer: mars3d.layer.GraphicLayer): OpenAir {
    return new OpenAir(layer, json.positions, json.name)
  }

  toModelData(areaId: string): ModelData {
    const pos = castTo2DArr(this.positions)
    const position = mars3d.PolyUtil.centerOfMass(this.positions)
    return new ModelData(areaId, this.id, this.name, pos, position, 7, 1)
  }
}
