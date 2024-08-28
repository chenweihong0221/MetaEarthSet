<script setup lang="ts">
// import "ant-design-vue/dist/antd.css"
import { addModel, deleteModel, getModel, getThree } from "@mars/pages/demo/api/api"
import { Area, getAllAreaIdAndName } from "@mars/pages/demo/module/model/Area"
import { mapKey, stateKey } from "@mars/pages/demo/module/store/store"
import { loadJSON } from "@mars/pages/demo/module/tool/persistence"
import { message } from "ant-design-vue"
import type { Dayjs } from "dayjs"
import { onMounted, reactive, ref } from "vue"
import { useStore } from "vuex"
import { Building } from "../module/model/Building"
import { OpenAir } from "../module/model/OpenAir"

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
const getData = ref(true)
const districtId = ref("")

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
    getModel(params)
      .then(function (response) {
        // 处理成功情况
        AreaList.value = response.data.data[0].children
        selectedArea.value = response.data.data[0].children[0].name
        stateStore.commit("updateSelectedAreaId", selectedArea.value)
        newBuilding(response.data.data[0].children, response.data.data[0].children[0].code)
      })
      .catch(function (error) {
        // 处理错误情况
        console.log(error)
      })
      .finally(function () {
        // 总是会执行
        firstApi.value = false
      })
  }
})

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
  console.log("AreaAdd", AreaAdd.value)
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
  AreaAdd.value.name = newArea.name
  console.log("AreaAdd", AreaAdd.value)
  addModel(AreaAdd.value).then(res => {
    if (res.data.code === "0") {
      districtId.value = res.data.data
      selectedArea.value = res.data.data
      stateStore.commit("updateSelectedAreaId", selectedArea.value)
      newArea.id = res.data.data
      AreaList.value.push(newArea)
      message.success("新增区域成功")
    }
  })
}

const handleCancel = () => {
  inputAreaName.value = ""
  showModal.value = false
}

const handleClick = () => {
  console.log("下拉列表切换事件")
  store.commit("flytoHome")
}

const handleArea = (area) => {
  districtId.value = area.districtId
  store.commit("setDistrictCode", districtId.value)
  stateStore.commit("updateSelectedAreaId", selectedArea.value)
  const params = {
    childrenParentCode: "",
    name: area.name
  }
  console.log("store.state", stateStore.state.selectedAreaId)
  getModel(params)
    .then(function (response) {
      // 处理成功情况
      console.log("AreaList", response)
      newBuilding(response.data.data[0].children, area.code)
    }).catch(function (error) {
      // 处理错误情况
      console.log(error)
    })
}

function newBuilding(children, code) {
  for (let i = 0; i < children.length; i++) {
    if (children[i].code === code) {
      console.log("children", children[i])
      getBuilding(children[i].children)
      break
    }
  }
}

function getBuilding(children) {
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.districtType === 3) {
        const building = new Building(store.state.graphicLayer, null, child.name, null, null, null, true, child.districtId, false)
        store.commit("addBuilding", building)
        stateStore.commit("updateLeftBarNeedUpdate", true)
      }
      if (child.districtType === 7) {
        const openAir = new OpenAir(store.state.graphicLayer, null, child.name, null, child.districtId, false)
        store.commit("addOpenAir", openAir)
        stateStore.commit("updateLeftBarNeedUpdate", true)
      }
    }
    getBuilding(children.children)
  }
}

const handleDel = () => {
  deleteModel(districtId.value).then(response => {
    if (response.data.code === "0") {
      const params = {
        childrenParentCode: "",
        name: ""
      }
      getModel(params)
        .then(function (response) {
          // 处理成功情况
          AreaList.value = response.data.data[0].children
          selectedArea.value = response.data.data[0].children[0].name
          stateStore.commit("updateSelectedAreaId", selectedArea.value)
          console.log("AreaList", AreaList.value)
        })
        .catch(function (error) {
          // 处理错误情况
          console.log(error)
        })
        message.success("删除区域成功")
    }
  })
}

</script>

<template>
  <!-- <div class="borderstyle" style="position: absolute; top: 0;  width: 100%; height: 5em; background: gray"> -->
  <div class="border" style="position: absolute; top: 0;  width: 100%; height: 4em; background: #555555">
    <a-space class="space" style="position: static; margin-top: 10px; margin-left: 20px">
      <div style="color: white">选择区域：</div>
      <a-select style="width: 130px; " class="c_mars-select" popupClassName="mars-select-dropdown"
        @change="handleSelectAreaChange" v-model:value="selectedArea">
        <a-select-option v-for="area in AreaList" :key="area.code" :value="area.code"
        @click="handleArea(area)">
          {{ area.name }}
        </a-select-option>
        <a-select-option key="0">
          添加区域
        </a-select-option>
      </a-select>
      <mars-button class="my-button" @click="handleSave">
        <template #icon><mars-icon icon="save" class="icon-vertical-a" width="16" /></template>
        保存
      </mars-button>
      <mars-button class="my-button" @click="handleDel">
        <template #icon><mars-icon icon="delete" class="icon-vertical-a" width="16" /></template>
        删除
      </mars-button>
      <mars-button class="my-button" @click="handleImportClick">
        <div style="visibility: hidden; position: absolute"><input id="import-button" type="file" @change="handleImport"
            accept=".json"></div>

        <template #icon><mars-icon icon="save" class="icon-vertical-a" width="16" /></template>
        导入
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
    <a-modal v-model:open="showModal">
      <template #title>
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
  </div>
</template>


<style lang="less" scoped>
.c_mars-select {
  width: 100%;
  height: 32px;

  //modify by cwh 20240809
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
