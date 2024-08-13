<template>
  <div id="centerDiv" class="centerDiv-container">
    <mars-map :url="configUrl" @onload="marsOnload" />
    <left-bar />
    <right-bar/>
    <top-bar @save="save" @import="importJson"/>
  </div>
</template>

<script setup lang="ts">
import MarsMap from "@mars/components/mars-work/mars-map.vue"
import { useRouter } from "vue-router"
import { provide, ref, watchEffect } from "vue"
import * as mars3d from "mars3d"
import { Building } from "@mars/pages/demo/module/Building"
import RightBar from "@mars/pages/demo/components/RightBar.vue"
import LeftBar from "@mars/pages/demo/components/LeftBar.vue"
import TopBar from "@mars/pages/demo/components/TopBar.vue"
import message from "ant-design-vue/es/message"
import { useStore } from "vuex"
import { mapKey } from "@mars/pages/demo/module/store"
import cameraDrawStore from "@mars/pages/demo/module/CameraStore"
import graphicDrawStore from "@mars/pages/demo/module/GraphicDrawStore"
import Flv from "flv.js"

const Cesium = mars3d.Cesium

// 编辑器变量
const startDraw = ref(false)
// 选中的graphic, 使用provide和inject传递给rightBar
const selectedGraphicId = ref("")
provide("selectedGraphicId", selectedGraphicId)
const router = useRouter()

const graphicLayer = new mars3d.layer.GraphicLayer({
  drawEndEventType: mars3d.EventType.middleClick
})
const graphicLayer2d = new mars3d.layer.GraphicLayer({
  drawEndEventType: mars3d.EventType.middleClick
})

// 获取自定义的store， 存储全局变量
const store = useStore(mapKey)
store.commit("setGraphicLayer", graphicLayer)
store.commit("setGraphicLayer2d", graphicLayer2d)

const configUrl = `${process.env.BASE_URL}config/config.json`
let tiles3dLayer: any
// 保存图层内所有模型到localStorage
const save = () => {
  const buildingMap = store.state.buildingMap
  const buildings: Building[] = Array.from(buildingMap.values())
  console.log("buildings", buildings)
  const buildingArrJson = Building.arrayToJSON(buildings)
  const saveJsonObject = {
    buildingMap: buildingArrJson,
    graphicBuildingMap: JSON.stringify(Array.from(buildingMap.value.entries()))
  }
  const saveJson = JSON.stringify(saveJsonObject)
  // 保存到本地
  console.log("saveJson", saveJson)
  localStorage.setItem("saveJson", saveJson)
  message.success("保存成功")
}
// 从localStorage导入图层
const importJson = () => {
  const saveJson = localStorage.getItem("saveJson")
  if (saveJson) {
    console.log("saveJson", saveJson)
    const saveJsonObject = JSON.parse(saveJson)
    const jsonArrStr: string = saveJsonObject.buildingMap
    const buildingArr = Building.fromJSONArray(jsonArrStr, graphicLayer)
    store.commit("clearMap")
    buildingArr.forEach(item => {
      store.commit("addBuilding", item)
    })
  }
}
const marsOnload = (map: any) => {
  console.log("lang object:", mars3d.Lang)
  store.commit("setMap", map)
  // 修改显示
  mars3d.Lang["_双击完成绘制"] = "点击滚轮完成绘制"
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "石化工厂",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    // position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    position: { lng: 113.5264, lat: 34.817292, alt: -30 },
    rotation: { z: 43, y: 0, x: 0 },

    maximumScreenSpaceError: 1,
    // shadows: Cesium.ShadowMode.DISABLED,
    // 以下参数可以参考用于3dtiles总数据大，清晰度过高情况下进行性能优化。这不是一个通用的解决方案，但可以以此为参考。
    skipLevelOfDetail: true,
    loadSiblings: true,
    cullRequestsWhileMoving: true,
    cullRequestsWhileMovingMultiplier: 10,
    preferLeaves: true,
    preloadWhenHidden: true,
    enableDebugWireframe: true, // 是否可以进行三角网的切换显示
    // 以上为优化的参数

    // popup: "all",
    highlight: {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      outlineEffect: true, // 采用OutlineEffect方式来高亮
      color: "#00FF00",
      width: 6
    },
    center: { lat: 34.813178, lng: 113.529168, alt: 354, heading: 319, pitch: -23 },
    flyTo: false
  })
  // 加载油田联合站模型
  const tiles3dLayer2 = new mars3d.layer.TilesetLayer({
    pid: 2020,
    type: "3dtiles",
    name: "油田联合站",
    url: "//data.mars3d.cn/3dtiles/max-ytlhz/tileset.json",
    // position: { lng: 117.270617, lat: 31.815012, alt: 26.4 },
    position: { lng: 113.5264, lat: 34.825, alt: 0 },
    rotation: { x: 0, y: 0, z: 116.2 },
    maximumScreenSpaceError: 1
    // center: { lat: 34.82, lng: 113.5264, alt: 3361, heading: 358, pitch: -51 }
  })
  map.addLayer(tiles3dLayer2)

  // del by cwh 20240809
  // const label = new mars3d.graphic.LabelEntity({
  //   position: { lng: 113.526183, lat: 34.816372, alt: 26.8 },
  //   rotation: { z: 43, y: 0, x: 0 },
  //   style: {
  //     text: "安全工厂",
  //     fontSize: 24,
  //     color: "#FFFFFF",
  //     outline: true,
  //     outlineColor: "#000000",
  //     horizontalOrigin: mars3d.Cesium.HorizontalOrigin.CENTER,
  //     verticalOrigin: mars3d.Cesium.VerticalOrigin.BOTTOM,
  //     pixelOffsetY: 0
  //   }
  // })
  // map.graphicLayer.addGraphic(label)

  map.addLayer(tiles3dLayer)
  // 设置编辑功能，先注释掉不用
  map.addLayer(graphicLayer)
  map.addLayer(graphicLayer2d)

  // 2.在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function(event: any) {
    console.log("监听layer，单击了矢量对象", event)
    if (startDraw.value) {
      return
    }
    selectedGraphicId.value = event.graphic.id
    console.log("selectedGraphicId", selectedGraphicId.value)
  })
}

watchEffect(() => {
  if (graphicDrawStore.state.graphicDraw) {
    GraphicDraw()
    graphicDrawStore.commit("toggleGraphicDraw")
  }
  if (cameraDrawStore.state.cameraDraw) {
    addCamera()
    cameraDrawStore.commit("toggleCameraDraw")
  }
})

// 添加图上标绘
const GraphicDraw = () => {
  graphicLayer.startDraw({
    type: "divBillboard"
  })

  function handleClick(event) {
    const cartesian = new Cesium.Cartesian3(event.cartesian.x, event.cartesian.y, event.cartesian.z)

    // 将笛卡尔坐标转换为 Cartographic 坐标
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)

    // 提取经纬度和高度
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const height = cartographic.height

    addGraphicDraw(graphicLayer, [longitude, latitude, height])

    // 移除事件监听器，确保只执行一次
    store.state.map.off(mars3d.EventType.click, handleClick)
  }

  // 监听绘制完成
  store.state.map.on(mars3d.EventType.click, handleClick)
}
const addGraphicDraw = (graphicLayer, position) => {
  const graphicImg = new mars3d.graphic.DivGraphic({
    position,
    style: {
      html: `     <div class="mars3d-graphicDraw-content">
                      <img class="mars3d-graphicDraw-img"
                        src="/public/img/icon/textPnl.png"
                        alt="样式一"
                      >
<!--                      <img class="mars3d-graphicDraw-img" -->
<!--                            src="/public/img/icon/div1.png" -->
<!--                            alt="样式二"-->
<!--                      >-->
                    </div>

                    <div class="mars3d-draw-content-wrapper">
                      <div class="draw-style-content"
                            style="font-size: 23px;display: flex;align-items: center;justify-content: center;"
                            >
                        ${graphicDrawStore.state.selectedGraphicDrawContent}
                      </div>
                    </div>
                  `,
      offsetX: -16,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
    }
  })
  graphicLayer.addGraphic(graphicImg)
  store.state.graphicDrawMap.set(graphicImg.id, graphicImg)
}

const addCamera = () => {
  graphicLayer.startDraw({
    type: "divBillboard"
  })

  function handleClick(event) {
    const cartesian = new Cesium.Cartesian3(event.cartesian.x, event.cartesian.y, event.cartesian.z)

    // 将笛卡尔坐标转换为 Cartographic 坐标
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)

    // 提取经纬度和高度
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const height = cartographic.height

    addCameraGraphicDraw(graphicLayer, [longitude, latitude, height])

    // 移除事件监听器，确保只执行一次
    store.state.map.off(mars3d.EventType.click, handleClick)
  }

  // 监听绘制完成
  store.state.map.on(mars3d.EventType.click, handleClick)
}
// 增加摄像头，并控制视频流的导入
const addCameraGraphicDraw = (graphicLayer, position) => {
  const flvUrl = "http://47.93.190.98:80/rtp/34020000001310000002_34020000001310000001.live.flv"
  const graphicImg = new mars3d.graphic.DivGraphic({
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
                    id="videoFLV"
                    autoplay="autoplay"
                    loop=""
                    crossorigin=""
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
  graphicLayer.addGraphic(graphicImg)
  store.state.cameraMap.set(graphicImg.id, graphicImg)

  graphicImg.on(mars3d.EventType.popupOpen, function (event) {
    const videoElement = event.container.querySelector("#videoFLV") // popup对应的DOM
    if (Flv.isSupported() && videoElement) {
      const flvPlayer = Flv.createPlayer({
        type: "flv",
        url: flvUrl
      })
      flvPlayer.attachMediaElement(videoElement)
      flvPlayer.load()
      flvPlayer.play()
    } else {
      console.log("camera error: 无法解析视频流格式")
      console.log("url:" + flvUrl)
    }
  })
}

const back = () => {
  router.back()
}
const createBuilding = (layer: mars3d.layer.GraphicLayer, positions: Cesium.Cartesian3[]): Building => {
  const building = new Building(layer, positions)
  store.commit("addBuilding", building)
  return building
}
const getFloorByFloorIdAndBuildingId = (floorId: string, buildingId: string) => {
  const building = store.getters.getBuildingById(buildingId)
  return building.floors.get(floorId)
}

</script>

<style>
@import "../style/camera.css";
@import "../style/mapdraw.css";

.centerDiv-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
