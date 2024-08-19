<script setup lang="ts">

import SelectModeBox from "@mars/pages/demo/components/RightBar/SelectModeBox.vue"

import DrawModeBox from "@mars/pages/demo/components/RightBar/DrawModeBox.vue"
import { stateKey } from "@mars/pages/demo/module/store/store"
import { useStore } from "vuex"
import { Cesium } from "mars3d"

const stateStore = useStore(stateKey)
// // 假设有经纬度
// var longitude = Cesium.Math.toRadians(116.3883)
// var latitude = Cesium.Math.toRadians(39.9289)
// // 创建一个椭球体（默认为 WGS84）
// var ellipsoid = Cesium.Ellipsoid.WGS84
// // 创建一个基于该经纬度的切平面
// var tangentPlane = new Cesium.EllipsoidTangentPlane(ellipsoid, Cesium.Cartesian3.fromDegrees(longitude, latitude))
// // 假设你有一个相对于该点的本地东向、北向和高度（以米为单位）
// var localEast = 100
// // 本地东向距离
// var localNorth = 50
// // 本地北向距离
// var localHeight = 0
// // 相对于切平面的高度（通常为零）
// // 转换为 ECEF 坐标
// var position = tangentPlane.projectPointOntoPlane(new Cesium.Cartesian3(localEast, localNorth, localHeight), ellipsoid.getScaledCartographic(Cesium.Cartesian3.fromDegrees(longitude, latitude)))
// console.log(position) // 输出 XYZ 坐标


</script>

<template>
  <div class="border">
    <div class="draw-mode-box" v-show="stateStore.state.topBarState === '1'">
      <draw-mode-box/>
    </div>

    <div class="wrapper" v-show="stateStore.state.topBarState === '2'">
      <select-mode-box />
    </div>
  </div>
</template>

<style scoped lang="less">
.border {
  position: absolute;
  top: 4em;
  right: 0;
  width: 25em;
  height: 100%;
  background: #555555;
  overflow-y: scroll;

}

.draw-mode-box {
  position: absolute;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}


.wrapper {
  position: absolute;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}


</style>
