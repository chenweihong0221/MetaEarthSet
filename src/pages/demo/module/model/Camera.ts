import * as mars3d from "mars3d"
import Flv from "flv-h265.js"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { mapStore } from "@mars/pages/demo/module/store/store"
import { Cesium } from "mars3d"

export class Camera implements GraphicInterface {
  id: string
  graphic: mars3d.graphic.DivGraphic
  layer: mars3d.layer.GraphicLayer
  position: mars3d.Cesium.Cartesian3

  show: boolean = true // 是否显示
  flvUrl: string

  constructor(id: string, flvUrl: string, position: mars3d.Cesium.Cartesian3, layer: mars3d.layer.GraphicLayer) {

    this.id = id
    this.flvUrl = flvUrl
    this.layer = layer
    this.position = position
    this.graphic = new mars3d.graphic.DivGraphic({
      position,
      style: {
        html: `     <div class="mars3d-camera-content">
                      <img class="mars3d-camera-img" src="/public/img/icon/camera.svg" alt="camera"/>
                    </div>
                    <div class="mars3d-camera-line" ></div>
                    <div class="mars3d-camera-point"></div>
                  `,
        offsetX: -16,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
      },
      popup: `<video style="width: 240px;height:130px;"
                    id="videoPlay"
                    autoplay="autoplay"
                    loop=""
                    crossorigin=""
                    controls="controls"
                    >
              </video>`,
      popupOptions: {
        offsetY: -240, // 显示Popup的偏移值，是DivGraphic本身的像素高度值
        template: `<div class="marsBlackPanel animation-spaceInDown">
                        <div class="marsBlackPanel-text">{content}</div>
                        <span class="mars3d-popup-close-button closeButton" style="color: white" >×</span>
                      </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
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

  toJSONObject(): any {
    return {
      id: this.id,
      flvUrl: this.flvUrl,
      position: this.position
    }
  }

  static fromJSONObject(json: any): Camera {
    return new Camera(json.id, json.flvUrl, json.position, mapStore.state.graphicLayer)
  }

}
