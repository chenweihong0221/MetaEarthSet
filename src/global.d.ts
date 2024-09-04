export {}

declare global {
  interface Window {
    graphWallTest: any // 露天广场的地面wall，仅用于demo演示，可以根据这个方式使用全局变量，以解决无法修改绘制模型的问题
    drawGraphicLayer: any // 用于存储绘制的模型的图层
  }
}
