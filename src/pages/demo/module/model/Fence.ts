import * as mars3d from "mars3d"
import { Cesium, LngLatPoint } from "mars3d"

export class Fence {
  id: string
  polygon: mars3d.graphic.ScrollWall
  height: number
  name: string

  constructor(positions: Cesium.Cartesian3[] | LngLatPoint[], name?: string, height?: number) {
    this.height = height || 30
    this.name = name || "围栏"
    this.polygon = new mars3d.graphic.ScrollWall({
      positions,
      name: name || "围栏",
      style: {
        materialType: mars3d.MaterialType.WallScroll,
        diffHeight: this.height,
        materialOptions: {
          color: "#d75ee1",
          count: 3,
          speed: 20,
          bloom: true
        },
        opacity: 0.8
      }
    })
    this.id = this.polygon.id.toString()
  }
}
