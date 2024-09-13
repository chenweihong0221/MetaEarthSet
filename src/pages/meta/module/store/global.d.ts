import * as mars3d from "mars3d"
import { Camera } from "mars3d-cesium"
export { }
declare global {
  interface Window {
    polygonWall: Map<string, mars3d.graphic.ThickWall>
    polygonEntity: Map<string, mars3d.graphic.PolygonEntity> // 露天广场的地面wall，仅用于demo演示，可以根据这个方式使用全局变量，以解决无法修改绘制模型的问题
    polygonToParent: Map<string, any> // 存储所有实体对象 key:id
    polygonCamera: Map<string, any> // 只存储camera对象
    polygonMan: Map<string, any> // 只存储人员对象
    polygonPolyline: Map<string, any> // 存储线对象
    divGraphic: Map<string, mars3d.graphic.DivGraphic> // 绘制div类型的模型
    drawGraphicLayer: any // 用于存储绘制的模型的图层
  }
}
