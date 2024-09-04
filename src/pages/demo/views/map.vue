<template>
  <div id="centerDiv" class="centerDiv-container">
    <mars-map :url="configUrl" @onload="marsOnload" />
    <left-bar />
    <right-bar />
    <top-bar />
  </div>
</template>

<script setup lang="ts">
import MarsMap from "@mars/components/mars-work/mars-map.vue"
import { useRouter } from "vue-router"
import { provide, ref, watchEffect } from "vue"
import * as mars3d from "mars3d"
import { Building } from "@mars/pages/demo/module/model/Building"
import RightBar from "@mars/pages/demo/components/RightBar.vue"
import LeftBar from "@mars/pages/demo/components/LeftBar.vue"
import TopBar from "@mars/pages/demo/components/TopBar.vue"
import message from "ant-design-vue/es/message"
import { useStore } from "vuex"
import { mapKey, stateStore } from "@mars/pages/demo/module/store/store"
import { Area } from "@mars/pages/demo/module/model/Area"

const Cesium = mars3d.Cesium

// 编辑器变量
const startDraw = ref(false)
// 选中的graphic, 使用provide和inject传递给rightBar
const selectedGraphicId = ref("")
provide("selectedGraphicId", selectedGraphicId)
const router = useRouter()



// 获取自定义的store， 存储全局变量
const store = useStore(mapKey)


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
  // 添加高亮样式
  const highLight = new mars3d.effect.OutlineEffect({
    color: "#FFFF00",
    width: 4,
    eventType: null
  })
  map.addEffect(highLight)
  store.commit("setOutlineEffect", highLight)
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
  const graphicLayer = new mars3d.layer.GraphicLayer({
    drawEndEventType: mars3d.EventType.middleClick
  })
  const graphicLayer2d = new mars3d.layer.GraphicLayer({
    drawEndEventType: mars3d.EventType.middleClick
  })

  window.drawGraphicLayer = graphicLayer
  store.commit("setGraphicLayer", graphicLayer)
  store.commit("setGraphicLayer2d", graphicLayer2d)
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
  // Area.getFromLocalStorage(stateStore.state.selectedAreaCode)
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
