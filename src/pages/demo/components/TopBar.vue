<script setup lang="ts">
import { SmileOutlined, SnippetsOutlined, SelectOutlined, EditOutlined } from "@ant-design/icons-vue"
// import "ant-design-vue/dist/antd.css"
import { defineEmits, onMounted, reactive, ref, watch } from "vue"
import type { Dayjs } from "dayjs"
import MarsButton from "@mars/components/mars-ui/mars-button/index.vue"
import MarsIcon from "@mars/components/mars-ui/mars-icon/index.vue"
import { useStore } from "vuex"
import { mapKey, stateKey } from "@mars/pages/demo/module/store/store"
import { loadFromLocalStorage, loadJSON, save, saveToLocalStorage } from "@mars/pages/demo/module/tool/persistence"
import { Area, getAllAreaIdAndName } from "@mars/pages/demo/module/model/Area"
import { getThree } from "@mars/pages/demo/api/api"

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
const selectedArea = ref(areaOptions.value && areaOptions.value[0] && areaOptions.value[0].id ? areaOptions.value[0].id : "")
const inputAreaName = ref("")
const showModal = ref(false)

onMounted(() => {
  stateStore.commit("updateSelectedAreaId", selectedArea.value)
})

const handleSave = () => {
  saveToLocalStorage(selectedArea.value)
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
  getThree()
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
  areaOptions.value = getAllAreaIdAndName()
  inputAreaName.value = ""
  showModal.value = false
  selectedArea.value = newArea.id
  store.commit("clearMap")
  stateStore.commit("updateLeftBarNeedUpdate", true)
}

const handleCancel = () => {
  inputAreaName.value = ""
  showModal.value = false
}

const handleClick = () => {
  console.log("下拉列表切换事件")
  store.commit("flytoHome")
}

const data = ref()

const getData = ref(true)

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

const getMessage = () => {
  if (getData) {
    getThree()
      .then(function (response) {
        // 处理成功情况
        AreaList.value = response.data
        console.log(AreaList.value)
      })
      .catch(function (error) {
        // 处理错误情况
        console.log(error)
      })
      .finally(function () {
        // 总是会执行
        getData.value = false
      })
  }

}

</script>

<template>
  <!-- <div class="borderstyle" style="position: absolute; top: 0;  width: 100%; height: 5em; background: gray"> -->
  <div class="border" style="position: absolute; top: 0;  width: 100%; height: 4em; background: #555555">
    <a-space class="space" style="position: static; margin-top: 10px; margin-left: 20px">
      <div style="color: white">选择区域：</div>
      <a-select style="width: 130px; " class="c_mars-select" popupClassName="mars-select-dropdown"
        @change="handleSelectAreaChange" @click="getMessage" v-model:value="selectedArea">
        <a-select-option v-for="area in AreaList" :key="area.code" :value="area.code">
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


    <a-space style="position: absolute; top: 80px; right: 390px">
      <a-button class="tools-button" @click="handleClick">
        <template #icon><mars-icon icon="home-two" class="icon-vertical-a" width="20" /></template>
      </a-button>
    </a-space>
    <a-modal v-model:open="showModal" @ok="handleOk" @cancel="handleCancel">
      <template #title>
        <div>添加区域</div>
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
