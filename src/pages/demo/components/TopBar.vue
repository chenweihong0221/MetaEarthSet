<script setup lang="ts">
import { SmileOutlined, SnippetsOutlined, SelectOutlined, EditOutlined } from "@ant-design/icons-vue"
// import "ant-design-vue/dist/antd.css"
import { defineEmits, reactive, ref } from "vue"
import type { Dayjs } from "dayjs"
import MarsButton from "@mars/components/mars-ui/mars-button/index.vue"
import MarsIcon from "@mars/components/mars-ui/mars-icon/index.vue"
import { useStore } from "vuex"
import { mapKey, stateKey } from "@mars/pages/demo/module/store/store"
import { loadFromLocalStorage, save } from "@mars/pages/demo/module/tool/persistence"

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

// 下拉列表切换事件
const onSelectChange = (value: string, data: any) => {
  // $message("您选择了：" + data.label)
  console.log("下拉列表切换事件", data)
}

const selectedValue = ref("1") // 假设默认选中“选项1”

// 下拉列表数据
const modelOptions = [
  {
    value: "xuanxiang",
    label: "选项模式"
  },
  {
    value: "huizhi",
    label: "绘制模式"
  }
]

const emits = defineEmits(["save", "import"])
const handleSave = () => {
  save()
}

const handleImport = () => {
  loadFromLocalStorage()
}

const seleiconlist = [
  {
    value: "account-book", label: "account-book"
  },
  {
    value: "appstore", label: "appstore"
  }
]

const handleChange = (value: string) => {
  console.log(`Selected: ${value}`)
  stateStore.commit("updateTopBarState", value)
}


const handleClick = () => {
  console.log("下拉列表切换事件")
  store.commit("flytoHome")
}

</script>

<template>
  <!-- <div class="borderstyle" style="position: absolute; top: 0;  width: 100%; height: 5em; background: gray"> -->
  <div class="border" style="position: absolute; top: 0;  width: 100%; height: 4em; background: #555555">
    <a-space style="position: absolute; top: 10px; left: 20px">
      <!-- <mars-button @click="handleSave">保存</mars-button> -->
      <mars-button class="my-button" @click="handleSave">
        <template #icon><mars-icon icon="save" class="icon-vertical-a" width="16" /></template>
        保存
      </mars-button>
      <mars-button class="my-button" @click="handleImport">
        <template #icon><mars-icon icon="save" class="icon-vertical-a" width="16" /></template>
        导入
      </mars-button>
      <!-- <SmileOutlined />
      <SnippetsOutlined /> -->
    </a-space>
    <!-- <a-space style="position: absolute; top: 10px; left: 240px">
      <mars-button @click="handleImport">导入</mars-button>
    </a-space> -->
    <!-- mars-select无法添加图片，所以使用a-select -->
    <!-- <a-space style="position: absolute; top: 10px; left: 150px">
      <div style="width: 110px; height: 100px;">
        <mars-select v-model:value="selectedValue" :options="modelOptions" @change="onSelectChange">
        </mars-select>
      </div>
    </a-space> -->

    <a-space style="position: absolute; top: 10px; left: 150px">
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

    <!-- <a-space style="position: absolute; top: 10px; left: 350px">
      <a-select size="large" placeholder="请选择图标" style="width: 200px" @change="handleChange">
        <a-select-option v-for="item  in seleiconlist" :key="item .value" :value="item.value">
          <template #prefix>
            <SnippetsOutlined />
          </template>
          {{ item.label }}
        </a-select-option>
      </a-select>
    </a-space>

    <a-space style="position: absolute; top: 10px; left: 750px">
      <a-select size="large" placeholder="请选择图标" style="width: 200px" @change="handleChange">
        <a-select-option v-for="i in seleiconlist" :key="i.value">
          <SnippetsOutlined />
        </a-select-option>
      </a-select>
    </a-space> -->

    <!-- <a-collapse>
      <a-collapse-panel style="position: absolute; top: 10px; left: 95px; background: white" key="8" header="选项模式">
        <p>{{ 1 }}</p>
      </a-collapse-panel>
    </a-collapse> -->


    <a-space style="position: absolute; top: 80px; right: 390px">
      <a-button class="tools-button" @click="handleClick">
        <template #icon><mars-icon icon="home-two" class="icon-vertical-a" width="20" /></template>
      </a-button>
    </a-space>
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
  color: #333; /* 示例：修改文字颜色 */
}

/* 自定义下拉框项样式 */
.my-custom-select::v-deep .ant-select-dropdown-menu-item {
  background-color: #2a2a2a;
  color: #333; /* 示例：修改文字颜色 */
}

/* 自定义选中项的样式 */
.my-custom-select::v-deep .ant-select-dropdown-menu-item-selected {
  background-color: #060606; /* 示例：修改背景颜色 */
  color: #fff; /* 示例：修改文字颜色 */
}

</style>
