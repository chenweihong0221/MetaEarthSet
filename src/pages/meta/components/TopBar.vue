<script setup lang="ts">
// import "ant-design-vue/dist/antd.css"
import { addModel, deleteModel, getModel, getThree, getDetail, getCamera, getHumen } from "@mars/pages/meta/api/api"
import { Cesium } from "mars3d"
import * as mars3d from "mars3d"
import { Area, getAllAreaIdAndName } from "@mars/pages/meta/module/model/Area"
import { mapKey, stateKey } from "@mars/pages/meta/module/store/store"
import { loadJSON } from "@mars/pages/meta/module/tool/persistence"
import { message } from "ant-design-vue"
import type { Dayjs } from "dayjs"
import { onMounted, reactive, ref } from "vue"
import { useStore } from "vuex"
import { Building, Floor, Space } from "../module/model/Building"
import { Fence } from "@mars/pages/meta/module/model/Fence"
import { OpenAir } from "../module/model/OpenAir"
import { GraphicDraw } from "@mars/pages/meta/module/model/GraphicDraw"
import { Camera } from "@mars/pages/meta/module/model/Camera"
import { Human } from "../module/model/Human"
import { BackgroundColor } from "@icon-park/svg"
import { color } from "echarts"

interface FormState {
  url: string
  extent: string
  countCar: number
  model: string
  date: Dayjs | null
  brightness: number
  contrast: [number, number]
  checkboxVal: string[]
  radioVal: string
  isScale: boolean
  color: string
}

// 获取自定义的store， 存储全局变量
const store = useStore(mapKey)
const stateStore = useStore(stateKey)

const formState = reactive<FormState>({
  url: "",
  extent: "",
  countCar: 1,
  model: "",
  date: null,
  brightness: 0,
  contrast: [-188, 128],
  checkboxVal: ["mars"],
  radioVal: "3",
  isScale: true,
  color: "#ffff00"
})
// 下拉列表数据
const areaOptions = ref<{ id: string, name: string }[]>(getAllAreaIdAndName())
const selectedValue = ref("1") // 假设默认选中“选项1”
const selectedArea = ref()
const inputAreaName = ref("")
const showModal = ref(false)
const makeDelete = ref(false)
const getData = ref(true)
const districtId = ref("")
const timer = ref(null)

// 获取区域信息
const AreaList = ref([
  {
    name: "",
    code: "",
    areaOptions: "",
    parentCode: "",
    parentName: "",
    districtLevel: "",
    districtType: "",
    updateUserName: "",
    updateTime: "",
    longitudeAndLatitudeJson: ""
  }
])

const firstApi = ref(true)

onMounted(() => {
  if (firstApi.value) {
    const params = {
      childrenParentCode: "",
      name: ""
    }
    // 初始化全局墙壁和矢量图层(露天广场)
    getModel(params)
      .then(function (response) {
        if (response.data.code === "0") {
          // 处理成功情况
          districtId.value = response.data.data[0].children[0].districtId
          AreaList.value = response.data.data[0].children
          selectedArea.value = response.data.data[0].children[0].code
          stateStore.commit("updateSelectedAreaCode", selectedArea.value)
          stateStore.commit("updateSelectedAreaId", districtId.value)
          getAllModel()
        } else {
          message.error(response.data.msg)
        }
      })
      .catch(function (error) {
        // 处理错误情况
        // console.log(error)
        console.error("catched error=", error)
      })
      .finally(function () {
        // 总是会执行
        firstApi.value = false
      })
  }
})

const timeGetHuman = () => {
  // 获取人员位置
  getHumen().then(function (response) {
    if (response.data.code === "0") {
      const human = response.data.data
      getHuman(human)
      // 定时获取
      timer.value = setTimeout(() => {
        // store.commit("clearHumenMap")
        timeGetHuman()
      }, 2000)
    } else {
      message.error(response.data.msg)
      // 关闭递归调用人员位置接口
      clearTimeout(timer.value)
    }
  })
}

const handleSave = () => {
  // saveToLocalStorage(selectedArea.value)
  // 新增区域
  const AreaAdd = ref(
    {
      districtType: 2,
      name: selectedArea.value,
      parentCode: ""
    }
  )
  AreaAdd.value.name = selectedArea.value
  addModel(AreaAdd.value)
  getThree()
    .then(function (response) {
      // 处理成功情况
      AreaList.value = response.data.data
      console.log("AreaList", AreaList.value)
    })
    .catch(function (error) {
      // 处理错误情况
      console.log(error)
    })
}

const handleImport = event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function (e) {
      try {
        console.log(e)
        // 将读取到的内容转换为字符串，并尝试将其解析为 JSON 对象
        const data = e.target.result
        // 创建一个 TextDecoder 实例
        const decoder = new TextDecoder()
        // 假设 data 是可能为 string 或 ArrayBuffer 的变量
        let jsonString
        if (typeof data === "string") {
          jsonString = data
        } else if (data instanceof ArrayBuffer) {
          jsonString = decoder.decode(data)
        }
        // 现在可以安全地解析 jsonString
        const jsonObj = JSON.parse(jsonString)
        // 如果需要，你可以在这里调用 loadFromLocalStorage 或其他处理逻辑
        loadJSON(jsonString)
      } catch (error) {
        console.error("Error parsing JSON:", error)
      }
    }
  }
}

const handleImportClick = () => {
  document.getElementById("import-button").click()
}

const handleChange = (value: string) => {
  console.log(`Selected: ${value}`)
  stateStore.commit("updateTopBarState", value)
}

const handleSelectAreaChange = (value: string) => {
  if (value === "0") {
    showModal.value = true
    store.state.graphicLayer.clear()
    selectedArea.value = ""
  } else {
    store.commit("clearMap")
    store.state.graphicLayer.clear()
    Area.getFromLocalStorage(value)
    console.log("selectedArea", selectedArea.value)
  }
  stateStore.commit("updateLeftBarNeedUpdate", true)
}

const handleOk = () => {
  const newArea = new Area(inputAreaName.value)
  inputAreaName.value = ""
  showModal.value = false
  const AreaAdd = ref(
    {
      districtType: 2,
      name: selectedArea.value,
      parentCode: ""
    }
  )
  store.commit("clearMap")
  AreaAdd.value.name = newArea.name
  addModel(AreaAdd.value).then(res => {
    if (res.data.code === "0") {
      // 关闭递归调用人员位置接口
      clearTimeout(timer.value)
      newArea.districtId = res.data.data.districtId
      newArea.code = res.data.data.code
      message.success("新增区域成功")
      // 重新获取区域下拉列表
      const params = {
        childrenParentCode: "",
        name: ""
      }
      getModel(params)
        .then(function () {
          // 处理成功情况
          districtId.value = newArea.districtId
          selectedArea.value = newArea.code
          AreaList.value.push(newArea)
          stateStore.commit("updateSelectedAreaCode", selectedArea.value)
          stateStore.commit("updateSelectedAreaId", districtId.value)
          // 初始化全局矢量图层
          initWindow()
          stateStore.commit("updateLeftBarNeedUpdate", true)
        })
        .catch(function (error) {
          // 处理错误情况
          console.log(error)
        })

    }
  })
}

const handleCancel = () => {
  inputAreaName.value = ""
  showModal.value = false
}

const handlelDelete = () => {
  makeDelete.value = true
}


const handleCancelDel = () => {
  makeDelete.value = false
}

const handleClick = () => {
  console.log("下拉列表切换事件")
  store.commit("flytoHome")
}

const handleArea = (area: any) => {
  if (area.districtId === districtId.value) {
    return
  }
  // 关闭递归调用人员位置接口
  clearTimeout(timer.value)
  districtId.value = area.districtId
  stateStore.commit("updateSelectedAreaCode", area.code)
  stateStore.commit("updateSelectedAreaId", area.districtId)
  store.commit("clearMap")
  getAllModel()
}

const getAllModel = () => {
  // 初始化全局墙壁和矢量图层(露天广场)
  initWindow()
  getDetail(districtId.value, districtId.value).then(function (response) {
    // 加载图层
    getBuilding(response.data.data.detailsInfoAndChildren)
  })
  // 获取人员位置
  timeGetHuman()
  // 获取监控设备
  const cameraParam = {
    current: 1,
    size: 100,
    deviceClassifyCode: "video"
  }
  getCamera(cameraParam).then(function (response) {
    if (response.data.code === "0") {
      const cameras = response.data.data.records
      getCameras(cameras)
    }
  })
  stateStore.commit("updateLeftBarNeedUpdate", true)
}

function getBuilding(parent) {
  const children = parent.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      // let positions = []
      // if (child.path === null || child.path === "") {
      //   positions = []
      // } else {
      //   positions = JSON.parse(child.path)
      // }
      let positions = []
      let lngLatPoint
      if (child.longitudeAndLatitudeJson !== null) {
        lngLatPoint = JSON.parse(child.longitudeAndLatitudeJson)
        for (let j = 0; j < lngLatPoint.length; j++) {
          const lngLat = lngLatPoint[j]
          positions.push(Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, lngLat.alt))
        }
      } else {
        positions = JSON.parse(child.path)
      }

      if (child.districtType === 3) {
        const building = new Building(store.state.graphicLayer, positions, child.name, 0, 5, null, true, child.districtId, child.code, false)
        getFloor(children[i], building)
      }
      if (child.districtType === 7) {
        const openAir = new OpenAir(store.state.graphicLayer, positions, child.name, null, child.districtId, false)
        store.commit("addOpenAir", openAir)
      }
      if (child.districtType === 8) {
        const fence = new Fence(positions, child.name, null, child.districtId, false)
        store.commit("addFence", fence)
      }
      if (child.districtType === 10) { // 图上标绘

        // const p_obj = child.position
        const t_p = new Cesium.Cartesian3(
          child.position.xAxis, // x 坐标
          child.position.yAxis, // y 坐标
          child.position.zAxis // z 坐标
        )
        let contentType = {
          type: 1,
          content: "1号楼"
        }
        if (child.content) {
          contentType = JSON.parse(child.content)
        }
        const graphicDraw = new GraphicDraw(child.name, contentType.content, lngLatPoint, contentType.type, child.districtId, false)
        store.commit("addGraphicDraw", graphicDraw)
      }
      getBuilding(children)
    }
  }
}

function getFloor(parent: any, building: Building) {
  const children = parent.children
  let floorNo = 0
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const positions = building.positions
      if (child.districtType === 4) {
        const newPosition: Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(
          positions,
          i * (5 + 0.1)
        ) as Cesium.Cartesian3[]
        floorNo += 1
        const floor = new Floor(newPosition, building, child.name, floorNo, null, child.districtId, parent.id, child.code, false)
        floor.code = child.code
        building.floors.set(child.districtId, floor)
        store.state.floorBuildingMap.set(floor.id, building.id)
        getSpace(child, floor)
      }
    }
  }
  store.state.buildingMap.set(building.id, building)
}

function getSpace(parent: any, floor: Floor) {
  const children = parent.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      let positions = []
      if (child.longitudeAndLatitudeJson !== null) {
        const lngLatPoint = JSON.parse(child.longitudeAndLatitudeJson)
        for (let j = 0; j < lngLatPoint.length; j++) {
          const lngLat = lngLatPoint[j]
          positions.push(Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, lngLat.alt))
        }
      } else {
        positions = JSON.parse(child.path)
      }
      if (child.districtType === 5) {
        const newPosition: Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(
          positions,
          0
        ) as Cesium.Cartesian3[]
        const space = new Space(newPosition, floor, child.name, null, child.districtId, false)
        floor.spaces.set(space.id, space)
        space.code = child.code
        store.state.spaceFloorMap.set(space.id, floor.id)
      }
    }
  }
}

function getCameras(cameras: any) {
  for (let i = 0; i < cameras.length; i++) {
    const child = cameras[i]
    let lngLat
    if (child.deviceExt) {
      const deviceExt = JSON.parse(child.deviceExt)
      lngLat = {
        lng: deviceExt.longitude,
        lat: deviceExt.latitude,
        alt: deviceExt.height
      }
    } else {
      lngLat = {
        lng: 0,
        lat: 0,
        alt: 0
      }
    }
    const flvUrl = "ws://47.93.190.98:80/rtp/34020000001310000002_34020000001310000001.live.flv"
    const position = Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, lngLat.alt)
    const camera = new Camera(child.id, child.deviceCode, flvUrl, position, store.state.graphicLayer)
  }
}

function getHuman(humen: any) {
  if (!humen || humen.length === 0) {
    return
  }
  for (let i = 0; i < humen.length; i++) {
    const data = humen[i]
    const lngLat = {
      lng: data.longitude,
      lat: data.latitude,
      alt: ((data.floorNumber - 1) * 5 + 0.6)
    }
    // 新增路线
    const polyLine = window.polygonPolyline.get(data.userName)
    const position = Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, lngLat.alt)
    console.log("获取路线", polyLine, lngLat)
    const human = window.polygonMan.get(data.userName)
    if (polyLine) {
      if (polyLine[polyLine.length - 1].lng !== lngLat.lng ||
        polyLine[polyLine.length - 1].lat !== lngLat.lat ||
        polyLine[polyLine.length - 1].alt !== lngLat.alt) {
        polyLine.push(lngLat)
      }
    }
    // 修改之前人物的位置和对象
    if (human) {
      human.model.position = position
      human.polyline.positions = polyLine
    } else {
      // 新建人物
      window.polygonPolyline.set(data.userName, [lngLat])
      const human = new Human(data.userName, position, store.state.graphicLayer)
      store.state.humanMap.set(human.id, human)
      stateStore.commit("updateLeftBarNeedUpdate", true)
    }
  }

}

const handleDel = () => {
  deleteModel(districtId.value).then(response => {
    if (response.data.code === "0") {
      makeDelete.value = false
      const params = {
        childrenParentCode: "",
        name: ""
      }
      stateStore.commit("updateLeftBarNeedUpdate", true)
      getModel(params)
        .then(function (response) {
          // 处理成功情况
          districtId.value = response.data.data[0].children[0].districtId
          AreaList.value = response.data.data[0].children
          selectedArea.value = response.data.data[0].children[0].code
          stateStore.commit("updateSelectedAreaCode", selectedArea.value)
          stateStore.commit("updateSelectedAreaId", districtId.value)
          // 关闭递归调用人员位置接口
          clearTimeout(timer.value)
          store.state.graphicLayer.clear()
          store.commit("clearMap")
          getAllModel()
        })
        .catch(function (error) {
          // 处理错误情况
          console.log(error)
        })
      message.success("删除区域成功")
    }
  })
}

function initWindow() {
  if (window.polygonWall === undefined) {
    window.polygonWall = new Map<string, mars3d.graphic.ThickWall>()
  } else {
    window.polygonWall.clear()
  }
  if (window.polygonEntity === undefined) {
    window.polygonEntity = new Map<string, mars3d.graphic.PolygonEntity>()
  } else {
    window.polygonEntity.clear()
  }
  if (window.polygonToParent === undefined) {
    window.polygonToParent = new Map<string, any>()
  } else {
    window.polygonToParent.clear()
  }
  if (window.divGraphic === undefined) {
    window.divGraphic = new Map<string, mars3d.graphic.DivGraphic>()
  } else {
    window.divGraphic.clear()
  }
  if (window.polygonCamera === undefined) {
    window.polygonCamera = new Map<string, any>()
  } else {
    window.polygonCamera.clear()
  }
  if (window.polygonMan === undefined) {
    window.polygonMan = new Map<string, any>()
  } else {
    window.polygonMan.clear()
  }
  if (window.polygonPolyline === undefined) {
    window.polygonPolyline = new Map<string, any>()
  } else {
    window.polygonPolyline.clear()
  }
}

</script>

<template>
  <!-- <div class="borderstyle" style="position: absolute; top: 0;  width: 100%; height: 5em; background: gray"> -->
  <div class="border" style="position: absolute; top: 0;  width: 100%; height: 4em; background: #555555">
    <a-space class="space" style="position: static; margin-top: 10px; margin-left: 20px">
      <a-select style="width: 130px; " class="c_mars-select" popupClassName="mars-select-dropdown"
        @change="handleSelectAreaChange" v-model:value="selectedArea">
        <a-select-option v-for="area in AreaList" :key="area.code" :value="area.code" @click="handleArea(area)">
          {{ area.name }}
        </a-select-option>
        <a-select-option key="0">
          添加区域
        </a-select-option>
      </a-select>
      <mars-button class="my-button" @click="handlelDelete">
        <template #icon><mars-icon icon="delete" class="icon-vertical-a" width="16" /></template>
        删除
      </mars-button>
      <!-- <SmileOutlined />
      <SnippetsOutlined /> -->
      <a-select v-model:value="selectedValue" style="width: 130px; " class="c_mars-select"
        popupClassName="mars-select-dropdown" @change="handleChange">
        <a-select-option key="2">
          <SelectOutlined />
          选项模式
        </a-select-option>
        <a-select-option key="1">
          <EditOutlined />
          绘制模式
        </a-select-option>
      </a-select>
    </a-space>


    <a-space style="position: absolute; top: 80px; right: 20%">
      <a-button class="tools-button" @click="handleClick">
        <template #icon><mars-icon icon="home-two" class="icon-vertical-a" width="20" /></template>
      </a-button>
    </a-space>
  </div>
  <a-modal v-model:open="showModal" contentStyle="width: 400px; color: red; background: red">
    <template #title >
      <div>添加区域</div>
    </template>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="ok" type="primary" @click="handleOk">确定</a-button>
    </template>
    <div>
      <div>区域名称：</div>
      <div><input type="text" v-model="inputAreaName"></div>
    </div>
  </a-modal>
  <!-- 删除区域弹窗 -->
  <a-modal v-model:open="makeDelete">
    <template #title>
      <div>确定删除吗?</div>
    </template>
    <template #footer>
      <a-button key="cancel" @click="handleCancelDel">取消</a-button>
      <a-button key="ok" type="primary" @click="handleDel">确定</a-button>
    </template>
  </a-modal>
</template>


<style lang="less" scoped>
/deep/ .ant-modal-body {
  background-color: red !important;
}

:deep(.modal .ant-modal-content) {
  width: 1000px;
  background-color: red !important;
  color: RED;
}

.c_mars-select {
  width: 100%;
  height: 32px;

  // modify by cwh 20240809
  // background-color: var(--mars-control-bg);
  background-color: #444444 !important;
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
}

// 使用 /deep/ 深度选择器（需要vue-loader 15+ 和相应的CSS作用域配置） 
.my-custom-select::v-deep .ant-select-arrow {
  color: #ffffff;
}

.my-custom-select::v-deep .ant-select-selector {
  /* 自定义选择器样式 */
  /* 示例：修改边框颜色 */
  border-color: #191a19;
  background-color: #2a2a2a;
  color: #ffffff;
  background: none;
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



.my-button,
.c_mars-select {
  margin-right: 20px;
}
</style>
