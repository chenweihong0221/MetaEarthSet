import * as mars3d from "mars3d"
import { Cesium } from "mars3d"
import { mapStore } from "@mars/pages/meta/module/store/store"
import { GraphicInterface } from "@mars/pages/meta/module/model/GraphicInterface"
import { ModelData } from "@mars/pages/meta/api/adopter"
import { castTo2DArr, convertToJSON, LngLatPointToJSON } from "@mars/pages/meta/module/tool/position"

export class Human implements GraphicInterface {
  id: string
  model: mars3d.graphic.ModelEntity
  layer: mars3d.layer.GraphicLayer
  positions: Cesium.Cartesian3
  show: boolean = true
  polyline: mars3d.graphic.PolylineEntity
  
  constructor(id: string, position: Cesium.Cartesian3, layer: mars3d.layer.GraphicLayer) {
    this.id = id
    this.name = id
    this.positions = position
    this.model = new mars3d.graphic.ModelEntity({
      position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/man/gongren.glb",
        scale: 1,
        minimumPixelSize: 50
      }
    })
    // polylinePositions = [
    //   [113.516004, 34.823779, 20.1],
    //   [113.515382, 34.823811, 0]
    // ]
    this.polyline = new mars3d.graphic.PolylineEntity({
      positions: window.polygonPolyline.get(this.id),
      style: {
        width: 5,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: Cesium.Color.fromBytes(255, 118, 118), // 中心线颜色
          alpha: 0.5,
          speed: 0
        }
      }
    })
    this.layer = layer
    window.drawGraphicLayer.addGraphic(this.model)
    window.drawGraphicLayer.addGraphic(this.polyline)
    window.polygonMan.set(this.id, this)
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
    const pos = castTo2DArr(this.positions)
    const path = convertToJSON(pos)
    const lngLatPoint = mars3d.LngLatPoint.fromCartesian(this.positions)
    const lngLatPointPath = {
      lng: lngLatPoint.lng,
      lat: lngLatPoint.lat,
      alt: lngLatPoint.alt
    }
    const jsonString = JSON.stringify(lngLatPointPath)
    return new ModelData(areaId, this.id, this.model.name, path, jsonString, this.positions, 1)
  }

  name: string
}
