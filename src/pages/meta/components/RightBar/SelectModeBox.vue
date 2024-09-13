<script setup lang="ts">
import { ref, watch } from "vue"
import { useStore } from "vuex"
import * as mars3d from "mars3d"
import MarsButton from "@mars/components/mars-ui/mars-button/index.vue"
import { mapKey, stateKey } from "@mars/pages/meta/module/store/store"
import { deleteModel, updateModel, getDetail } from "@mars/pages/meta/api/api"
import { message } from "ant-design-vue"
import { Cesium } from "mars3d"
import { castTo2DArr, convertToJSON, LngLatPointToJSON } from "@mars/pages/meta/module/tool/position"
import { Building, Floor } from "@mars/pages/meta/module/model/Building"
import { OpenAir } from "@mars/pages/meta/module/model/OpenAir"
import store from "../../widget-store"

const stateStore = useStore(stateKey)
const mapStore = useStore(mapKey)
const graphicDrawOptions = ref(["材质1", "材质2", "材质3", "材质4"])

const selectedGraphicId = ref("")
// 变换部分

// 信息部分
const name = ref("")
const content = ref("")
const contentShow = ref(false)
const type = ref("")
const show = ref(true)
const startEdit = ref<boolean>(false)
const lat = ref()
const lng = ref()
const alt = ref()
const scale = ref()
const rotateX = ref()
const rotateY = ref()
const rotateZ = ref()

// mars3d.PolyUtil.centerOfMass 获取多点坐标的中心点
// mars3d.LngLatPoint.fromCartesian 将笛卡尔坐标系转换为经纬度
watch(
  () => stateStore.state.selectedGraphicId,
  (val) => {
    selectedGraphicId.value = val
    if (val === "") {
      name.value = ""
      content.value = ""
      type.value = ""
      show.value = true
      contentShow.value = false
      return
    }
    const selectedType = stateStore.state.selectedGraphicType
    let position: mars3d.Cesium.Cartesian3
    contentShow.value = false
    if (selectedType === 0) {
      const building = mapStore.state.buildingMap.get(val)
      name.value = building.name
      type.value = "建筑"
      show.value = building.show
      position = mars3d.PolyUtil.centerOfMass(building.positions)
    } else if (selectedType === 1) {
      // type为1， 选中的图形为楼层
      const floor = mapStore.getters.getFloorByFloorId(val)
      name.value = floor.name
      type.value = "楼层"
      show.value = floor.polygon.show
      position = mars3d.PolyUtil.centerOfMass(floor.positions)
    } else if (selectedType === 2) {
      // type为2， 选中的图形为空间
      const space = mapStore.getters.getSpaceBySpaceId(val)
      name.value = space.name
      type.value = "空间"
      show.value = space.polygon.show
      position = mars3d.PolyUtil.centerOfMass(space.polygon.positions)
    } else if (selectedType === 3) {
      // type为3， 选中的图形为围栏
      const fence = mapStore.getters.getFenceByFenceId(val)
      name.value = fence.name
      type.value = "围栏"
      show.value = fence.polygon.show
      position = mars3d.PolyUtil.centerOfMass(fence.polygon.positions)
    } else if (selectedType === 4) {
      // type为4， 选中的图形为露天场所
      const openAir = mapStore.getters.getOpenAirByOpenAirId(val)
      name.value = openAir.name
      type.value = "露天场所"
      show.value = openAir.show
      position = mars3d.PolyUtil.centerOfMass(openAir.positions)
    } else if (selectedType === 5) {
      // type为5， 选中的图形为图上标绘
      const graphicDraw = window.polygonToParent.get(val)
      name.value = graphicDraw.name
      content.value = graphicDraw.content
      type.value = "图上标绘"
      show.value = graphicDraw.graphic.show
      contentShow.value = true
      position = mars3d.PolyUtil.centerOfMass(graphicDraw.positions)
    } else if (selectedType === 6) {
      // type为6， 选中的图形为模型
      const model = mapStore.getters.getHumanByHumanId(val)
      name.value = model.id
      type.value = "人员"
      show.value = model.show
    } else if (selectedType === 7) {
      // type为7， 选中的图形为模型
      const model = mapStore.getters.getCameraByCameraId(val)
      name.value = model.id
      type.value = "摄像头"
      show.value = model.show
    }
    const point = mars3d.LngLatPoint.fromCartesian(position)
    lat.value = point.lat
    lng.value = point.lng
    alt.value = point.alt
  }
)

const onMessageNameChange = () => {
  const val = stateStore.state.selectedGraphicId
  const selectedType = stateStore.state.selectedGraphicType
  if (selectedType === 1) {
    // type为1， 选中的图形为楼层
    const floor = mapStore.getters.getFloorByFloorId(val)
    floor.name = name.value
  } else if (selectedType === 2) {
    // type为2， 选中的图形为空间
    const space = mapStore.getters.getSpaceBySpaceId(val)
    space.name = name.value
  } else if (selectedType === 3) {
    // type为3， 选中的图形为围栏
    const fence = mapStore.getters.getFenceByFenceId(val)
    fence.name = name.value
  } else if (selectedType === 4) {
    // type为4， 选中的图形为露天场所
    const openAir = mapStore.getters.getOpenAirByOpenAirId(val)
    openAir.name = name.value
  } else if (selectedType === 5) {
    // type为5， 选中的图形为图上标绘
    const graphicDraw = window.polygonToParent.get(val)
    graphicDraw.name = name.value
  } else if (selectedType === 6) {
    // type为6， 选中的图形为模型
    const human = mapStore.getters.getHumanByHumanId(val)
    human.id = name.value
  }
}

const onMessageContentChange = () => {
  const val = stateStore.state.selectedGraphicId
  const graphicDraw = mapStore.getters.getGraphicDrawByGraphicDrawId(val)
  graphicDraw.content = content.value
}

const deleteStore = () => {
  const id = stateStore.state.selectedGraphicId
  if (id === "") {
    return
  }
  const selectedType = stateStore.state.selectedGraphicType
  if (selectedType === 0) {
    mapStore.commit("removeBuilding", id)
  } else if (selectedType === 1) {
    // type为1， 选中的图形为楼层
    mapStore.commit("removeFloor", id)
  } else if (selectedType === 2) {
    // type为2， 选中的图形为空间
    mapStore.commit("removeSpace", id)
  } else if (selectedType === 3) {
    // type为3， 选中的图形为围栏
    mapStore.commit("removeFence", id)
  } else if (selectedType === 4) {
    // type为4， 选中的图形为露天场所
    mapStore.commit("removeOpenAir", id)
  } else if (selectedType === 5) {
    // type为5， 选中的图形为图上标绘
    window.divGraphic.get(id).destroy()
    mapStore.commit("removeGraphicDraw", id)
  } else if (selectedType === 6) {
    mapStore.commit("removeHuman", id)
  } else if (selectedType === 7) {
    mapStore.commit("removeCamera", id)
  }
  name.value = ""
  content.value = ""
  selectedGraphicId.value = ""
  type.value = ""
  console.log("id", id)
  deleteModel(id).then((res) => {
    if (res.data.code === "0") {
      message.success(res.data.msg)
    }
  })
  stateStore.commit("updateLeftBarNeedUpdate", true)
}
const updateStore = () => {
  const id = stateStore.state.selectedGraphicId
  const selectedType = stateStore.state.selectedGraphicType
  if (id === "") {
    return
  }
  let params
  if (selectedType === 5) {
    const graphicDraw = window.polygonToParent.get(id)
    params = {
      districtId: id,
      name: name.value,
      content: {
        name: content.value,
        type: graphicDraw.type
      }
    }
  } else {
    params = {
      districtId: id,
      name: name.value
    }
  }
  updateModel(params).then((res) => {
    if (res.data.code === "0") {
      if (selectedType === 0) {
        mapStore.state.buildingMap.get(id).name = name.value
      } else if (selectedType === 4) {
        mapStore.state.openAirMap.get(id).name = name.value
      }
      message.success(res.data.msg)
    } else {
      message.error(res.data.msg)
    }
    stateStore.commit("updateLeftBarNeedUpdate", true)
  })

}

const handleShowChange = (param) => {
  const value = param.target.checked
  console.log("handleShowChange", value)
  const selectedType = stateStore.state.selectedGraphicType
  const id = stateStore.state.selectedGraphicId
  if (selectedType === 0) {
    const building = mapStore.state.buildingMap.get(id)
    building.setShow(value)
  } else if (selectedType === 1) {
    // type为1， 选中的
    const floor = mapStore.getters.getFloorByFloorId(id)
    floor.setShow(value)
  } else if (selectedType === 2) {
    // type为2， 选中的图形为空间
    const space = mapStore.getters.getSpaceBySpaceId(id)
    space.setShow(value)
  } else if (selectedType === 3) {
    // type为3， 选中的图形为围栏
    const fence = mapStore.getters.getFenceByFenceId(id)
    fence.setShow(value)
  } else if (selectedType === 4) {
    // type为4， 选中的图形为露天场所
    const openAir = mapStore.getters.getOpenAirByOpenAirId(id)
    openAir.setShow(value)
  } else if (selectedType === 5) {
    // type为5， 选中的图形为图上标绘
    const graphicDraw = window.polygonToParent.get(id)
    graphicDraw.setShow(value)
  } else if (selectedType === 6) {
    // type为6， 选中的图形为模型
    const human = mapStore.getters.getHumanByHumanId(id)
    human.setShow(value)
  }
}

const beginStore = () => {
  const id = stateStore.state.selectedGraphicId
  const selectedType = stateStore.state.selectedGraphicType
  if (startEdit.value) {
    if (selectedType === 0) {
      const building = mapStore.state.buildingMap.get(id)
      const floor = building.getFirstFloor()
      window.drawGraphicLayer.stopEditing(window.polygonEntity.get(floor.id))
      const positions = window.polygonEntity.get(floor.id).editing.positions
      building.updateFloorPositions(positions, true)
      const pos = castTo2DArr(positions)
      const path = convertToJSON(pos)
      const lngLatPoint = positions.map((position) => mars3d.LngLatPoint.fromCartesian(position))
      const lngLatPointPath = LngLatPointToJSON(lngLatPoint)
      const params = {
        districtId: building.id,
        path: path.toString(),
        longitudeAndLatitudeJson: lngLatPointPath.toString()
      }
      updateModel(params).then((res) => {
        if (res.data.code === "0") {
          message.success(res.data.msg)
        } else {
          message.error(res.data.msg)
        }
      })
      building.showAllFloors()
    } else if (selectedType === 3) {
      window.drawGraphicLayer.stopEditing(window.polygonWall.get(id))
      const positions = window.polygonWall.get(id).positions
      const pos = castTo2DArr(positions)
      const path = convertToJSON(pos)
      const lngLatPoint = positions.map((position) => mars3d.LngLatPoint.fromCartesian(position))
      const lngLatPointPath = LngLatPointToJSON(lngLatPoint)
      const params = {
        districtId: id,
        path: path.toString(),
        longitudeAndLatitudeJson: lngLatPointPath.toString()
      }
      // 调取修改接口
      updateModel(params).then((res) => {
        if (res.data.code === "0") {
          message.success(res.data.msg)
        } else {
          message.error(res.data.msg)
        }
      })
      startEdit.value = false
    } else if (selectedType === 4) {
      window.drawGraphicLayer.stopEditing(window.polygonEntity.get(id))
      const positions = window.polygonEntity.get(id).editing.positions
      window.polygonWall.get(id).positions = positions
      window.polygonWall.get(id).show = true
      // 生成接口参数
      let newPositions: Cesium.Cartesian3[]
      if (positions[0] instanceof mars3d.Cesium.Cartesian3) {
        newPositions = positions as Cesium.Cartesian3[]
      } else {
        newPositions = (positions as { x: number; y: number; z: number }[]).map((item) => {
          return new Cesium.Cartesian3(item.x, item.y, item.z)
        })
      }
      const pos = castTo2DArr(newPositions)
      const path = convertToJSON(pos)
      const lngLatPoint = positions.map((position) => mars3d.LngLatPoint.fromCartesian(position))
      const lngLatPointPath = LngLatPointToJSON(lngLatPoint)
      const params = {
        districtId: id,
        path: path.toString(),
        longitudeAndLatitudeJson: lngLatPointPath.toString()
      }
      // 调取修改接口
      updateModel(params).then((res) => {
        if (res.data.code === "0") {
          message.success(res.data.msg)
        } else {
          message.error(res.data.msg)
        }
      })
    }
    startEdit.value = false
  } else {
    if (selectedType === 0) {
      const building = mapStore.state.buildingMap.get(id)
      building.onlyShowFirstFloor()
      const floor = building.getFirstFloor()
      window.drawGraphicLayer.startEditing(window.polygonEntity.get(floor.id))
    } else if (selectedType === 3) {
      window.drawGraphicLayer.startEditing(window.polygonWall.get(id))
    } else {
      window.polygonWall.get(id).show = false
      window.drawGraphicLayer.startEditing(window.polygonEntity.get(id))
    }
    startEdit.value = true
  }
}
</script>

<template>
  <div class="wrapper">
    <div class="trans-panel">
      <a-collapse>
        <a-collapse-panel header="变换" key="1">
          <div class="trans-box">
            <div class="trans-row">
              <div>
                经度
                <input v-model="lng" />
              </div>
              <div>
                维度
                <input v-model="lat" />
              </div>
              <div>
                海拔
                <input v-model="alt" />
              </div>
            </div>
            <div class="trans-row">
              旋转：
              <div>x <input v-model="rotateX" disabled /></div>
              <div>y <input v-model="rotateY" disabled /></div>
              <div>z <input v-model="rotateZ" disabled /></div>
            </div>
            <div class="trans-row">
              缩放：
              <div><input v-model="scale" disabled />%</div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em" />
    <div class="msg-panel">
      <a-collapse>
        <a-collapse-panel header="信息" key="2">
          <div class="msg-box">
            <div class="msg-row">
              <div class="msg-name">名称：</div>
              <input class="msg-name-input" v-model="name" @change="onMessageNameChange" />
            </div>
            <div class="msg-row" v-show="contentShow">
              <div class="msg-name">内容：</div>
              <input class="msg-name-input" v-model="content" @change="onMessageContentChange" />
            </div>
            <div class="msg-row">
              <div class="msg-name">id：&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <input class="msg-name-input" v-model="selectedGraphicId" disabled @change="onMessageNameChange" />
            </div>
            <div class="msg-row">
              <div class="msg-name">类型：</div>
              <div>{{ type }}</div>
            </div>
            <div class="msg-row">
              <div class="msg-name">显示：</div>
              <div>
                <a-checkbox v-model:checked="show" @change="handleShowChange" />
              </div>
            </div>
            <div class="msg-row">
              <mars-button class="my-button-interaction" @click="deleteStore">删除</mars-button>
              <mars-button class="my-button-interaction" @click="updateStore">修改</mars-button>
            </div>
            <div class="msg-row">
              <mars-button class="my-button-edit" @click="beginStore" v-show="!startEdit">开始编辑</mars-button>
              <mars-button class="my-button-edit" @click="beginStore" v-show="startEdit">停止编辑</mars-button>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em" />
    <div class="material-panel">
      <a-collapse>
        <a-collapse-panel header="材质" key="3">
          <div class="material-box">
            <div class="material-row">
              <div>名称：&nbsp;&nbsp;</div>
              <input class="material-input" />
            </div>
            <div class="material-row">
              <div>材质流：</div>
              <a-select v-model:value="graphicDrawOptions"
                style="left: 10px; color: white; rgba(35, 39, 47, 0.7);!important;" class="c_mars-select"
                popupClassName="mars-select-dropdown">
                <a-select-option key="1"> 材质1 </a-select-option>
                <a-select-option key="2"> 材质2 </a-select-option>
                <a-select-option key="3"> 材质3 </a-select-option>
                <a-select-option key="4"> 材质4 </a-select-option>
              </a-select>
            </div>
            <div class="material-row">
              <div>颜色：&nbsp;&nbsp;</div>
              <input type="color" class="material-input-color" style="width: 2em; border: none; padding: 0" />
            </div>
            <div class="material-row">
              <div>贴图：&nbsp;&nbsp;</div>
              <input type="color" class="material-input-color" style="width: 2em; border: none; padding: 0" />
            </div>
            <div class="material-row">
              <div>透明度：</div>
              <a-slider class="material-slider" :min="0" :max="1" :step="0.01" />
            </div>
            <div style="height: 2px"></div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<style scoped lang="less">
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.trans-panel,
.msg-panel,
.material-panel {
  width: 95%;
  background: #999999;
  border-radius: 3px;
}

.trans-box,
.msg-box,
.material-box {
  color: white;
  background: #999999;
}

.trans-row,
.msg-row,
.material-row {
  display: flex;
  align-items: center;
  margin-left: 1em;
  height: 3em;
}

.msg-name {
  margin-right: 1em;
}

.msg-name-input {
  width: 15em;
  padding-left: 0.5em;
}

.material-slider {
  width: 15em;
  color: rgba(35, 39, 47, 0.7);
}

input {
  width: 4em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  background-color: rgba(35, 39, 47, 0.7);
  border: rgba(234, 242, 255, 0.15);
  border-radius: 2px;
  height: 2em;
  color: white;
}

.msg-name-input,
.material-input {
  width: 15em;
  margin-right: auto;
  margin-left: 1.15em;
}

.material-input-color {
  margin-left: 1.15em;
}

.material-slider {
  margin-left: 1.15em;
  width: 15em;
}

.ant-select-selector {
  background: #999999 !important;
  border: 1px solid #999999 !important;
  border-radius: 2px;
  color: white;
}

.c_mars-select {
  width: 15em;
  height: 32px;
  background-color: rgba(35, 39, 47, 0.7);
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

.ant-slider-track {
  background-color: rgb(255, 255, 255);
}

.my-button-interaction {
  margin: auto 1em;
  width: 90px;
  height: 32px;
  background-color: #444444 !important;
  border-color: #1DA57A !important;
  color: white;
}

.my-button-edit {
  margin: auto 1em;
  width: 100px;
  height: 32px;
  background-color: #444444 !important;
  border-color: #1DA57A !important;
  color: white;
}
</style>
