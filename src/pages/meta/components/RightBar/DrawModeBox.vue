<script setup lang="ts">
import { ref, watch } from "vue"
import { useStore } from "vuex"
import { mapKey, stateKey } from "@mars/pages/meta/module/store/store"
import * as mars3d from "mars3d"
import { Building, Floor, setHeight } from "@mars/pages/meta/module/model/Building"
import { Cesium } from "mars3d"
import MarsButton from "@mars/components/mars-ui/mars-button/index.vue"
import { CesiumRoleController } from "@mars/pages/meta/module/store/CesiumRoleController"
import { Fence } from "@mars/pages/meta/module/model/Fence"
import { OpenAir } from "@mars/pages/meta/module/model/OpenAir"
import { Human } from "@mars/pages/meta/module/model/Human"
import { GraphicDraw } from "@mars/pages/meta/module/model/GraphicDraw"
import { Camera } from "@mars/pages/meta/module/model/Camera"

// 1，3的时候直接绘制即可，2的时候要先选择楼层
const selectedState = ref<string>("1") // 当前状态，0 未绘制， 1 绘制建筑物， 2 绘制楼层内空间， 3 绘制围栏
const startDraw = ref<boolean>(false) // 当前是否正在绘制
// const nowState = inject("topBarState") // topBar 的nowState

const store = useStore(mapKey) // store
const stateStore = useStore(stateKey) // stateStore
const buildingName = ref<string>("1号楼") // 绘制建筑时输入的建筑物名称
const floorNum = ref<number>(5) // 绘制建筑时输入的楼层数量
const spaceName = ref<string>("会议室1") // 绘制空间时输入的空间名称
const fenceName = ref<string>("围栏") // 绘制围栏时输入的围栏名称
const openAirName = ref<string>("露天场所") // 绘制露天场所时输入的露天场所名称
const deviceId = ref<string>("246835") // 绘制围栏时选择的设备id
const humanId = ref<string>("358946") // 绘制围栏时选择的人员id
const selectedBuildingId = ref<string>("") // 绘制空间时选择的建筑物id
const selectedFloorId = ref<string>("") // 绘制空间时选择的楼层id
const selectableFloor = ref<Floor[]>([]) // 绘制空间时可选择的楼层
const collapseActiveKey = ref<string[]>(["1", "4", "5"]) // 折叠面板激活的key
const selectedGraphicDrawStyle = ref(1)
const selectedGraphicDrawContent = ref("1号楼") // 图上标绘内容
const graphicDrawOptions = ref([
  {
    value: 1,
    label: "传统样式"
  },
  {
    value: 2,
    label: "样式2"
  },
  {
    value: 3,
    label: "样式3"
  },
  {
    value: 4,
    label: "样式4"
  },
  {
    value: 5,
    label: "样式5"
  }
])

const style = "padding: 0; color: white; background: #999999; width:90%; " // 折叠面板样式
let personController = null

watch(selectedBuildingId, val => {
  console.log("selectedGraphicId changed", val)
  if (val) {
    selectableFloor.value = Array.from(store.getters.getBuildingById(val).floors.values())
    console.log("selectableFloor", selectableFloor.value)
  } else {
    selectableFloor.value = []
  }
})

// 更新左侧栏世界大纲信息显示
function drawCallback() {
  stateStore.commit("updateLeftBarNeedUpdate", true)
  console.log("drawCallback")
}

const stopDraw = () => {
  startDraw.value = false
  stateStore.commit("updateDrawType", startDraw.value)
  store.state.graphicLayer.stopDraw()
  store.state.graphicLayer2d.stopDraw()
  const selectedBuilding = store.getters.getBuildingById(selectedBuildingId.value)
  if (selectedBuilding) {
    selectedBuilding.showAllFloors()
  }
  if (personController) {
    personController.destroy()
  }
}

const drawBuilding = () => {
  startDraw.value = true
  stateStore.commit("updateDrawType", startDraw.value)
  store.state.map.onlyPickTerrainPosition = true
  store.state.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#106eac",
      opacity: 0.8
    }
  }).then(e => {
    startDraw.value = false
    stateStore.commit("updateDrawType", startDraw.value)
    store.state.map.onlyPickTerrainPosition = false
    const building = createBuilding(store.state.graphicLayer, e.positionsShow, buildingName.value, floorNum.value)
    if (buildingName.value) {
      building.name = buildingName.value
    }
    e.destroy()
    drawCallback()
  })

  store.state.graphicLayer2d.startDraw({
    type: "polygon",
    style: {
      color: "#57cec0",
      opacity: 0.5
    }
  }).then((e: any) => {
    e.destroy()
  })
}

const drawSpace = () => {
  // 首先进行一些前置检查
  if (!selectedFloorId.value) {
    alert("请先选择一个楼层")
    return
  }
  const floor = store.getters.getFloorByFloorId(selectedFloorId.value)
  console.log("selectedFloorName", floor)
  const selectedBuilding = store.getters.getBuildingById(selectedBuildingId.value)
  selectedBuilding.onlyShowFirstFloor()
  const groundFloor = setHeight(selectedBuilding.positions, 0)
  const groundPolygon = new mars3d.graphic.PolygonEntity({
    positions: groundFloor,
    style: {
      color: "#57cec0",
      opacity: 0.5
    }
  })
  store.state.graphicLayer2d.addGraphic(groundPolygon)
  startDraw.value = true
  stateStore.commit("updateDrawType", startDraw.value)
  store.state.map.onlyPickTerrainPosition = true
  window.drawGraphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#106eac",
      opacity: 0.8
    },
    validDrawPosition(...params) {
      const xyzLocation = params[0]
      // 根据xyzLocation的xyz转为Cesium.Cartesian3
      const cartographic = new Cesium.Cartesian3(xyzLocation.x, xyzLocation.y, xyzLocation.z)
      const selectedGraphic = store.getters.getFloorByFloorId(selectedFloorId.value).polygon
      console.log("able", mars3d.PolyUtil.isInPoly(cartographic, selectedGraphic.positionsShow))
      return mars3d.PolyUtil.isInPoly(cartographic, selectedGraphic.positionsShow)
    }
  }).then(e => {
    startDraw.value = false
    stateStore.commit("updateDrawType", startDraw.value)
    store.state.map.onlyPickTerrainPosition = false
    let space
    if (spaceName.value) {
      space = floor.addSpace(e.positionsShow, spaceName.value)
    } else {
      space = floor.addSpace(e.positionsShow)
    }
    if (space) {
      store.state.spaceFloorMap.set(space.id, selectedFloorId.value)
    }
    selectedBuilding.showAllFloors()
    groundPolygon.destroy()
    e.destroy(false)
    drawCallback()
  })
}

const createBuilding = (layer: mars3d.layer.GraphicLayer,
  positions: Cesium.Cartesian3[],
  name: string,
  floorNumber: number): Building => {
  const building = new Building(layer, positions, name, floorNumber, null, null, true, null, null, true)
  console.log(building)
  return building
}

const drawFence = () => {
  startDraw.value = true
  stateStore.commit("updateDrawType", startDraw.value)
  store.state.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#57cec0",
      opacity: 0.5
    }
  }).then(e => {
    startDraw.value = false
    stateStore.commit("updateDrawType", startDraw.value)
    const positions = e.positionsShow
    const fence = new Fence(positions, fenceName.value, null, null, true)
    store.commit("addFence", fence)
    e.remove()
    drawCallback()
  })
}

const createOpenAir = (layer: mars3d.layer.GraphicLayer,
  positions: Cesium.Cartesian3[],
  name: string): OpenAir => {
  const openAir = new OpenAir(layer, positions, name, null, null, true)
  return openAir
}

const drawOpenAir = (name: string) => {
  startDraw.value = true
  stateStore.commit("updateDrawType", startDraw.value)
  store.state.map.onlyPickTerrainPosition = true
  store.state.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#CECECE",
      opacity: 0.8
    }
  }).then(e => {
    startDraw.value = false
    stateStore.commit("updateDrawType", startDraw.value)
    store.state.map.onlyPickTerrainPosition = false
    const openAir = createOpenAir(store.state.graphicLayer, e.positionsShow, openAirName.value)
    if (openAirName.value) {
      openAir.name = openAirName.value
    }
    drawCallback()
    e.destroy()
  })
  store.state.graphicLayer2d.startDraw({
    type: "polygon",
    style: {
      color: "#CECECE",
      opacity: 0.5
    }
  }).then((e: any) => {
    e.destroy()
  })
}

const drawPerson = () => {
  console.log("human")
  if (humanId.value === "") {
    alert("请输入人员ID")
    return
  }
  startDraw.value = true
  stateStore.commit("updateDrawType", startDraw.value)
  store.state.map.setCursor("crosshair")
  store.state.map.once("click", event => {
    store.state.map.setCursor("default")
    personController = new CesiumRoleController(Cesium, store.state.map.viewer)
    const point = mars3d.LngLatPoint.fromCartesian(event.cartesian)
    personController.init({
      position: [point.lng, point.lat],
      url: "//data.mars3d.cn/gltf/mars/man/running.glb",
      animation: "run",
      lockViewLevel: 1,
      pitch: -25,
      speed: 2,
      range: 300.0
    })
    drawCallback()
  })

}

// 添加图上绘制功能
const handleGraphicDraw = () => {

  function handleClick(event) {
    console.log("handleClick=========")

    const cartesian = new Cesium.Cartesian3(event.cartesian.x, event.cartesian.y, event.cartesian.z)
    const graphicDraw = new GraphicDraw(selectedGraphicDrawContent.value, cartesian, selectedGraphicDrawStyle.value, "", true)

    // 放在GraphicDraw构造函数内
    // if (graphicDraw.postState === 0) {
    //   store.state.graphicDrawMap.set(graphicDraw.id, graphicDraw)
    //   drawCallback()
    // }
  }

  // 监听绘制完成
  store.state.map.once(mars3d.EventType.click, handleClick)
}
// 添加监控设备功能
const handleAddCamera = () => {
  store.state.map.setCursor("crosshair")
  store.state.map.once("click", event => {
    store.state.map.setCursor("default")
    const cartesian = new Cesium.Cartesian3(event.cartesian.x, event.cartesian.y, event.cartesian.z)

    // const flvUrl = "ws://47.93.190.98:80/rtp/34020000001320000111_34020000001320000011.live.flv"
    const flvUrl = "ws://47.93.190.98:80/rtp/34020000001310000002_34020000001310000001.live.flv"

    store.state.cameraMap.get(deviceId.value)?.graphic.destroy()
    const camera = new Camera(deviceId.value, flvUrl, cartesian, store.state.graphicLayer)
    store.state.cameraMap.set(camera.id, camera)
    deviceId.value = ""
    drawCallback()
  })
}
const handleAddHuman = () => {
  if (humanId.value === "") {
    alert("请输入人员ID")
    return
  }
  store.state.map.setCursor("crosshair")
  store.state.map.once("click", event => {
    store.state.map.setCursor("default")
    store.state.humanMap.get(humanId.value)?.model.destroy()
    const human = new Human(humanId.value, event.cartesian, store.state.graphicLayer)
    store.state.humanMap.set(human.id, human)
    humanId.value = ""
    console.log("human", human)
    drawCallback()
  })
}
</script>

<template>
  <div class="draw-mode-box" v-show="stateStore.state.topBarState === '1'">
    <div class="draw-select-panel">
      <a-collapse v-model:active-key="collapseActiveKey" :style="style">
        <a-collapse-panel key="1" header="绘制">
          <div class="select-draw-box">
            <div class="left-box">
              <div class="message" style="margin-left: 10px">
                选择绘制类型
              </div>
              <a-select v-model:value="selectedState" style="left: 10px" class="c_mars-select"
                popupClassName="mars-select-dropdown">
                <a-select-option key="1">
                  绘制建筑
                </a-select-option>
                <a-select-option key="2">
                  绘制场所
                </a-select-option>
                <a-select-option key="3">
                  绘制围栏
                </a-select-option>
                <a-select-option key="4">
                  绘制露天场所
                </a-select-option>
                <a-select-option key="6">
                  绘制人员
                </a-select-option>
              </a-select>
            </div>
            <div class="right-box">
              <div v-show="selectedState == '1'">
                <div class="message">建筑物名称</div>
                <input class="draw-select-input" v-model="buildingName" />
                <div class="message">楼层数量</div>
                <input class="draw-select-input" v-model="floorNum" />
              </div>
              <div v-show="selectedState == '2'">
                <div class="message">场所名称</div>
                <input class="draw-select-input" v-model="spaceName">
                <div class="message">所属建筑物</div>
                <a-select class="c_mars-select" v-model:value="selectedBuildingId">
                  <a-select-option v-for="building in store.state.buildingMap.values()" :key="building.id">
                    {{ building.name }}
                  </a-select-option>
                </a-select>
                <div class="message">所属楼层</div>
                <a-select class="c_mars-select" v-model:value="selectedFloorId">
                  <a-select-option v-for="floor in selectableFloor" :key="floor.id">
                    {{ floor.name }}
                  </a-select-option>
                </a-select>
              </div>

              <div v-show="selectedState == '3'">
                <div class="message">围栏名称</div>
                <input class="draw-select-input" v-model="fenceName" />
              </div>

              <div v-show="selectedState == '4'">
                <div class="message">露天场所名称</div>
                <input class="draw-select-input" v-model="openAirName" />
              </div>

              <mars-button class="my-button" @click="stopDraw"
                v-show="selectedState > '0' && startDraw">停止绘制</mars-button>
              <mars-button class="my-button" @click="drawBuilding"
                v-show="selectedState == '1' && !startDraw">开始绘制</mars-button>
              <mars-button class="my-button" @click="drawSpace"
                v-show="selectedState == '2' && !startDraw">开始绘制</mars-button>
              <mars-button class="my-button" @click="drawFence"
                v-show="selectedState == '3' && !startDraw">开始绘制</mars-button>
              <mars-button class="my-button" @click="drawOpenAir"
                v-show="selectedState == '4' && !startDraw">开始绘制</mars-button>
              <mars-button class="my-button" @click="drawPerson"
                v-show="selectedState == '6' && !startDraw">开始绘制</mars-button>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em" />
    <div class="draw-panel">
      <a-collapse :style="style" v-model:active-key="collapseActiveKey">
        <a-collapse-panel header="图上标绘" key="4">
          <div class="draw-box">
            <div class="draw-row">
              <div style="width: 20px">样式：</div>
              <a-select v-model:value="selectedGraphicDrawStyle" style="margin-left: 15px; color: white; width: 14em;
  margin-right: auto;" class="c_mars-select" popupClassName="mars-select-dropdown" :options="graphicDrawOptions" />
            </div>
            <div class="draw-row">
              <div style="width: 20px">内容：</div>
              <a-input class="draw-input" placeholder="1号楼" style="margin-left: 15px;"
                v-model:value="selectedGraphicDrawContent" />
            </div>
            <div class="draw-row">
              <div><mars-button class="my-button" @click="handleGraphicDraw">图上标绘</mars-button></div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em" />
    <div class="other-panel">
      <a-collapse v-model:active-key="collapseActiveKey">
        <a-collapse-panel header="其他" key="5">
          <div class="other-box">
            <div class="other-row">
              <div>设备ID：</div>
              <input class="other-input" v-model="deviceId">
            </div>
            <div class="other-row">
              <mars-button class="my-button" @click="handleAddCamera">监控设备</mars-button>
            </div>
            <div class="other-row">
              <div>人员ID： </div>
              <input class="other-input" v-model="humanId">
            </div>
            <div class="other-row">
              <mars-button class="my-button" @click="handleAddHuman">监控人员</mars-button>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div style="height: 8rem" />
  </div>
</template>

<style scoped lang="less">
.draw-mode-box {
  display: flex;
  justify-content: center;
  align-items: center
}


.draw-select-panel,
.draw-panel,
.other-panel {
  width: 90%;
  background: #999999;
  border-radius: 3px;
}

.select-draw-box {
  height: 100%;
  width: 100%;
  display: flex;
  background: #999999;
  padding-bottom: 20px;
}

.left-box {
  height: 100%;
  flex: 1;
  margin-right: 10px;
}

.right-box {
  height: 100%;
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
}

.left-select {
  width: 100%;
  height: 2em;
}

.message {
  text-align: left;
  font-size: 1em;
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
}

.wrapper {
  position: absolute;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}


/* 定义滚动条高宽及背景 */
::-webkit-scrollbar {
  width: 5px;
  height: 16px;
  background-color: #F5F5F5;
}

/* 定义滚动条轨道，包括内阴影和圆角 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px gray;
  border-radius: 10px;
  background-color: gray;
}

/* 定义滚动块，包括内阴影和圆角 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #F5F5F5;
}

.c_mars-select {
  width: 95%;
  height: 32px;
  background-color: var(--mars-control-bg);
  border-radius: 2px;
  box-shadow: none;

  :deep(.ant-select-selector) {
    height: 100% !important;
    border-color: var(--mars-control-border);
    border-radius: 2px;
    background: none;
    color: var(--mars-text-color);

    &:hover,
    &:focus {
      border-color: var(--mars-hover-color);
    }

    .ant-select-selection-item {
      color: var(--mars-control-text) !important;
      line-height: 32px !important;
    }
  }

  :deep(.ant-select-arrow) {
    color: var(--mars-control-placeholder);
  }
}

/* 使用 /deep/ 深度选择器（需要vue-loader 15+ 和相应的CSS作用域配置） */
.my-custom-select::v-deep .ant-select-arrow {
  color: #ffffff;
}

.my-custom-select::v-deep .ant-select-selector {
  /* 自定义选择器样式 */
  /* 示例：修改边框颜色 */
  border-color: #191a19;
  background: #2a2a2a none;
  color: #ffffff;
}

.my-custom-select::v-deep .ant-select-selector-selected {
  /* 自定义选择器样式 */
  /* 示例：修改边框颜色 */
  border-color: #191a19;
  background-color: #2a2a2a;
  color: #ffffff;
}

/* 自定义下拉框项样式 */
.my-custom-select::v-deep .ant-select-dropdown {
  background-color: #0a0606;
  color: #333;
  /* 示例：修改文字颜色 */
}

/* 自定义下拉框项样式 */
.my-custom-select::v-deep .ant-select-dropdown-menu-item {
  background-color: #2a2a2a;
  color: #333;
  /* 示例：修改文字颜色 */
}

/* 自定义选中项的样式 */
.my-custom-select::v-deep .ant-select-dropdown-menu-item-selected {
  background-color: #060606;
  /* 示例：修改背景颜色 */
  color: #fff;
  /* 示例：修改文字颜色 */
}

.mars-button {
  margin-top: 20px;
}

input {
  background-color: rgba(35, 39, 47, 0.7);
  height: 32px;
  color: #ffffff;
  border: rgba(234, 242, 255, 0.15);
  border-radius: 2px;
  text-align: justify;
  padding-left: 10px;
  width: 95%;
}

.draw-panel,
.other-panel {
  width: 90%;
  background: #999999;
  border-radius: 3px;
}


.draw-box,
.other-box {
  color: white;
  background: #999999;
}

.draw-row,
.other-row {
  display: flex;
  align-items: center;
  margin-left: 1em;
  height: 3em;
}

.draw-input,
.other-input {
  width: 14em;
  margin-right: auto;
}

.other-input {
  margin-left: 10px;
}

.other-row .my-button,
.draw-row .my-button {
  margin: auto 5em;
}

.draw-row .c_mars-select {
  width: 14em;
  padding: 0;
  margin: 0;
}
</style>
