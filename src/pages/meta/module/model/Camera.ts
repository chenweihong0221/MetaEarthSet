import * as mars3d from "mars3d"
import Flv from "flv-h265.js"
import { GraphicInterface } from "@mars/pages/meta/module/model/GraphicInterface"
import { mapStore } from "@mars/pages/meta/module/store/store"
import { Cesium } from "mars3d"
import { ModelData } from "@mars/pages/meta/api/adopter"
import { castTo2DArr, convertToJSON, LngLatPointToJSON } from "@mars/pages/meta/module/tool/position"
import { getCameraDetail } from "@mars/pages/meta/api/api"

export class Camera implements GraphicInterface {
  id: string
  name: string
  graphic: mars3d.graphic.DivGraphic
  layer: mars3d.layer.GraphicLayer
  position: mars3d.Cesium.Cartesian3
  code: string
  show: boolean = true // 是否显示
  flvUrl: string

  constructor(id: string, code: string, flvUrl: string, position: mars3d.Cesium.Cartesian3, layer: mars3d.layer.GraphicLayer) {
    this.id = id
    this.code = code
    this.name = id
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
    window.polygonToParent.set(this.id.toString(), this)
    this.graphic.on(mars3d.EventType.popupOpen, function (event) {
      getCameraDetail(id).then(function (response) {
        console.log(response)
      })
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
    return new Camera(json.id, json.code, json.flvUrl, json.position, mapStore.state.graphicLayer)
  }

  toModelData(areaId: string): ModelData {
    const pos = castTo2DArr(this.position)
    const path = convertToJSON(pos)
    const lngLatPoint = mars3d.LngLatPoint.fromCartesian(this.position)
    const lngLatPointPath = {
      lng: lngLatPoint.lng,
      lat: lngLatPoint.lat,
      alt: lngLatPoint.alt
    }
    const jsonString = JSON.stringify(lngLatPointPath)
    return new ModelData(areaId, this.id, this.name, path, jsonString, this.position, 2)
  }



}
