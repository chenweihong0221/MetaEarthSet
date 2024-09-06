import * as mars3d from "mars3d"
export { }
declare global {
  interface Window {
    polygonWall: Map<string, mars3d.graphic.ThickWall>
    polygonEntity: Map<string, mars3d.graphic.PolygonEntity> // 露天广场的地面wall，仅用于demo演示，可以根据这个方式使用全局变量，以解决无法修改绘制模型的问题
    polygonToParent: Map<string, any> // polygon所在的对象
    drawGraphicLayer: any // 用于存储绘制的模型的图层
  }
}
