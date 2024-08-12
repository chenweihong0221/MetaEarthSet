<script setup lang="ts">
import { ref, watch } from "vue"
import { useStore } from "vuex"
import { mapKey, stateKey } from "@mars/pages/demo/module/store"
import * as mars3d from "mars3d"
import { Building, Fence, Floor, OpenAir } from "@mars/pages/demo/module/Building"
import { Cesium } from "mars3d"
import MarsButton from "@mars/components/mars-ui/mars-button/index.vue"
import SelectModeBox from "@mars/pages/demo/components/RightBar/SelectModeBox.vue"

// 1，3的时候直接绘制即可，2的时候要先选择楼层
const selectedState = ref<string>("1") // 当前状态，0 未绘制， 1 绘制建筑物， 2 绘制楼层内空间， 3 绘制围栏
const startDraw = ref<boolean>(false) // 当前是否正在绘制
// const nowState = inject("topBarState") // topBar 的nowState

const store = useStore(mapKey) // store
const stateStore = useStore(stateKey) // stateStore
const buildingName = ref<string>("1号楼") // 绘制建筑时输入的建筑物名称
const floorNum = ref<number>(3) // 绘制建筑时输入的楼层数量
const spaceName = ref<string>("办公室1") // 绘制空间时输入的空间名称
const fenceName = ref<string>("围栏") // 绘制围栏时输入的围栏名称
const openAirName = ref<string>("露天场所") // 绘制露天场所时输入的露天场所名称
const selectedBuildingId = ref<string>("") // 绘制空间时选择的建筑物id
const selectedFloorId = ref<string>("") // 绘制空间时选择的楼层id
const selectableFloor = ref<Floor[]>([]) // 绘制空间时可选择的楼层
const collapseActiveKey = ref<string[]>(["1"]) // 折叠面板激活的key
const style = "padding: 0; color: white; background: #999999; width:90%; " // 折叠面板样式


watch(selectedBuildingId, val => {
  console.log("selectedGraphicId changed", val)
  if (val) {
    selectableFloor.value = Array.from(store.getters.getBuildingById(val).floors.values())
    console.log("selectableFloor", selectableFloor.value)
  } else {
    selectableFloor.value = []
  }
})
const stopDraw = () => {
  startDraw.value = false
  store.state.graphicLayer.stopDraw()
  store.state.graphicLayer2d.stopDraw()
  const selectedBuilding = store.getters.getBuildingById(selectedBuildingId.value)
  selectedBuilding.showAllFloors()
}

const drawBuilding = () => {
  startDraw.value = true
  store.state.map.onlyPickTerrainPosition = true
  store.state.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#106eac",
      opacity: 0.8
    }
  }).then(e => {
    startDraw.value = false
    store.state.map.onlyPickTerrainPosition = false
    const building = createBuilding(store.state.graphicLayer, e.positionsShow, buildingName.value, floorNum.value)
    if (buildingName.value) {
      building.name = buildingName.value
    }
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
  console.log("selectedFloorId", selectedFloorId.value)
  if (!selectedFloorId.value) {
    alert("请先选择一个楼层")
    return
  }
  const floor = store.getters.getFloorByFloorId(selectedFloorId.value)
  console.log("selectedFloorName", floor.name)
  const selectedBuilding = store.getters.getBuildingById(selectedBuildingId.value)
  selectedBuilding.onlyShowFloor(selectedFloorId.value)
  startDraw.value = true
  store.state.map.onlyPickTerrainPosition = true
  store.state.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#57cec0",
      opacity: 0.5
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
    store.state.map.onlyPickTerrainPosition = false
    let space
    if (spaceName.value) {
      space = floor.addSpace(e.positionsShow, spaceName.value)
    } else {
      space = floor.addSpace(e.positionsShow)
    }
    selectedBuilding.showAllFloors()
    e.remove()
  })
}

const createBuilding = (layer: mars3d.layer.GraphicLayer,
  positions: Cesium.Cartesian3[],
  name: string,
  floorNumber: number): Building => {
  const building = new Building(layer, positions, name, floorNumber)
  store.commit("addBuilding", building)
  return building
}

const drawFence = () => {
  startDraw.value = true
  store.state.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#57cec0",
      opacity: 0.5
    }
  }).then(e => {
    startDraw.value = false
    const positions = e.points
    const fence = new Fence(positions)
    store.commit("addFence", fence)
    e.remove()
  })
}

const createOpenAir = (layer: mars3d.layer.GraphicLayer,
  positions: Cesium.Cartesian3[],
  name: string): OpenAir => {
  const openAir = new OpenAir(layer, positions, name)
  store.commit("addOpenAir", openAir)
  return openAir
}

const drawOpenAir = () => {
  startDraw.value = true
  store.state.map.onlyPickTerrainPosition = true
  store.state.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#CECECE",
      opacity: 0.8
    }
  }).then(e => {
    startDraw.value = false
    store.state.map.onlyPickTerrainPosition = false
    const openAir = createOpenAir(store.state.graphicLayer, e.positionsShow, buildingName.value)
    if (openAirName.value) {
      openAir.name = openAirName.value
    }
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

</script>

<template>
  <div class="border">
    <div class="draw-mode-box" v-show="stateStore.state.topBarState === '1'">
      <a-collapse v-model:active-key="collapseActiveKey" :style="style">
        <a-collapse-panel key="1" header="绘制" :style="style">
          <div class="draw-box">
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
              </a-select>
            </div>
            <div class="right-box">
              <div v-show="selectedState == '1'">
                <div class="message">建筑物名称</div>
                <input v-model="buildingName" />
                <div class="message">楼层数量</div>
                <input v-model="floorNum" />
              </div>
              <div v-show="selectedState == '2'">
                <div class="message">场所名称</div>
                <input v-model="spaceName">
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
                <input v-model="fenceName" />
              </div>

              <div v-show="selectedState == '4'">
                <div class="message">露天场所名称</div>
                <input v-model="openAirName" />
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
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
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
  display: flex;
  justify-content: center;
  align-items: center
}

.draw-box {
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
</style>
