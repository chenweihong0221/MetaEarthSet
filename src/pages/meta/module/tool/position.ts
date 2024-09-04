import { Cesium } from "mars3d"

// 返回一个二维数组
export function castTo2DArr(positions: Cesium.Cartesian3 | Cesium.Cartesian3[] | { x: number; y: number; z: number }[]): number[][] {
  if (positions instanceof Array) {
    return positions.map((item) => {
      return [item.x, item.y, item.z]
    })
  }
  return [[positions.x, positions.y, positions.z]]
}
