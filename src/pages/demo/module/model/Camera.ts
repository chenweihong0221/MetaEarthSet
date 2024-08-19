import * as mars3d from "mars3d"
import Flv from "flv-h265.js"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { mapStore } from "@mars/pages/demo/module/store/store"

export class Camera implements GraphicInterface {
  id: string
  graphic: mars3d.graphic.DivGraphic
  layer: mars3d.layer.GraphicLayer

  show: boolean = true // 是否显示
  flvUrl: string

  constructor(id: string, flvUrl: string, graphic: mars3d.graphic.DivGraphic, layer: mars3d.layer.GraphicLayer) {
    this.graphic = graphic
    this.id = id
    this.flvUrl = flvUrl
    this.layer = layer
    this.layer.addGraphic(this.graphic)
    this.graphic.on(mars3d.EventType.popupOpen, function(event) {
      const videoElement = event.container.querySelector("#videoPlay") // popup对应的DOM
      // flv格式转换
      if (Flv.isSupported() && videoElement) {
        const flvPlayer = Flv.createPlayer({
          type: "flv",
          url: flvUrl
        })
        flvPlayer.attachMediaElement(videoElement)
        flvPlayer.load()
        flvPlayer.play()
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = flvUrl
        videoElement.play()
      } else {
        console.log("camera error: 无法解析视频流格式")
        console.log("url:" + flvUrl)
      }
    })
  }

  setShow(show: boolean): void {
    this.show = show
    this.graphic.show = show
  }

  highLight(): void {
    mapStore.state.outlineEffect.selected = [this.graphic]
  }

  removeHighLight(): void {
    mapStore.state.outlineEffect.selected = []
  }

  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.graphic)
  }

}
