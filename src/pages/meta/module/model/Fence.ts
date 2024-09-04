import * as mars3d from "mars3d"
import { Cesium, LngLatPoint } from "mars3d"
import { mapStore } from "@mars/pages/meta/module/store/store"
import { GraphicInterface } from "@mars/pages/meta/module/model/GraphicInterface"
import { castTo2DArr } from "@mars/pages/meta/module/tool/position"
import { ModelData } from "@mars/pages/meta/api/adopter"

export class Fence implements GraphicInterface {
  id: string
  polygon: mars3d.graphic.ScrollWall
  height: number
  name: string

  show: boolean = true // 是否显示

  constructor(positions: Cesium.Cartesian3[] | LngLatPoint[], name?: string, height?: number, id?: string) {
    this.height = height || 5
    this.name = name || "围栏"
    this.polygon = new mars3d.graphic.ScrollWall({
      positions,
      name: name || "围栏",
      style: {
        diffHeight: this.height,
        color: "#d75ee1",
        opacity: 0.8
      }
    })
    this.id = id || this.polygon.id.toString()
    mapStore.state.graphicLayer.addGraphic(this.polygon)
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
    return new ModelData(areaId, this.id, this.name, castTo2DArr(this.polygon.positions), 3)
  }
}
