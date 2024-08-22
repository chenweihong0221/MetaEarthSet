import * as mars3d from "mars3d"
import { Cesium } from "mars3d"
import { mapStore } from "@mars/pages/demo/module/store/store"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { ModelData } from "@mars/pages/demo/api/adopter"
import { castTo2DArr } from "@mars/pages/demo/module/tool/position"

export class Human implements GraphicInterface {
  id: string
  model: mars3d.graphic.ModelEntity
  layer: mars3d.layer.GraphicLayer
  positions: Cesium.Cartesian3
  show: boolean = true

  constructor(id: string, position: Cesium.Cartesian3, layer: mars3d.layer.GraphicLayer) {
    this.id = id
    this.name = id
    this.positions = position
    this.model = new mars3d.graphic.ModelEntity({
      position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/man/walk.gltf",
        scale: 1,
        minimumPixelSize: 50
      }
    })
    this.layer = layer
    this.layer.addGraphic(this.model)
  }

  setShow(show: boolean): void {
    this.show = show
    this.model.show = show
  }

  highLight(): void {
    mapStore.state.outlineEffect.selected = [this.model]
  }

  removeHighLight(): void {
    mapStore.state.outlineEffect.selected = []
  }

  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.model)
  }

  toJSONObject(): any {
    return {
      id: this.id,
      positions: this.positions
    }
  }

  static fromJSONObject(json: any, layer: mars3d.layer.GraphicLayer): Human {
    return new Human(json.id, json.positions, layer)
  }

  toModelData(areaId: string): ModelData {
    return new ModelData(areaId, this.id, this.model.name, castTo2DArr(this.positions), 1)
  }

  name: string
}
