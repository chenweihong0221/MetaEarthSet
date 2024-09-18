import { Cesium, LngLatPoint } from "mars3d"

// 返回一个二维数组
export function castTo2DArr(positions: Cesium.Cartesian3 | Cesium.Cartesian3[] | { x: number; y: number; z: number }[]): number[][] {
  if (positions instanceof Array) {
    return positions.map((item) => {
      return [item.x, item.y, item.z]
    })
  }
  return [[positions.x, positions.y, positions.z]]
}

// 将数组转换为JSON格式
export function convertToJSON(path: number[][]) {
  // 创建一个对象数组来存储路径点信息
  const pathObjects = path.map((point, index) => ({
    x: point[0],
    y: point[1],
    z: point[2]
  }))
  // 将对象数组转换为 JSON 字符串
  const jsonString = JSON.stringify(pathObjects)
  return jsonString
}

export function LngLatPointToJSON(lngLatPoint: LngLatPoint[]) {
  // 创建一个对象数组来存储路径点信息
  const pathObjects = lngLatPoint.map((point, index) => ({
    lng: point.lng,
    lat: point.lat,
    alt: point.alt
  }))
  // 将对象数组转换为 JSON 字符串
  const jsonString = JSON.stringify(pathObjects)
  return jsonString
}
