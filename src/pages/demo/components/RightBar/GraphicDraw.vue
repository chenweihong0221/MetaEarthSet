<template>
  <div class="graphic-wrapper">
    <div class="header-wrapper">
      <div style="display: flex;align-items: center">
        <div style="font-size: 30px;"> ></div>
        <div style="margin-left: 10px;font-size: 15px">图上标绘</div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="wrapper1">
        <h1>样式: </h1>
        <div style="margin-left: 20px; font-size: 14px">
          <a-space>
            <a-select
              ref="select"
              v-model:value="styleValue"
              style="width: 140px"
              :options="options"
              @focus="focus"
              @change="handleChange"
              size="small"
            ></a-select>
          </a-space>
        </div>
      </div>

      <div class="wrapper2">
        <h1>内容: </h1>
        <div style="margin-left: 20px; font-size: 14px">
          <a-space direction="vertical">
            <a-input v-model:value="contentValue"
                     placeholder="内容标注"
                     size="small"
                     style="width: 140px;"
                     maxlength="4"
            />
          </a-space>
        </div>
      </div>
    </div>

    <div class="footer-wrapper">
      <a-button style="width: 140px"
                size="small"
                @click="handleDraw"
      >
        图上标绘
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import GraphicDraw from "@mars/pages/demo/module/GraphicDrawStore"

const styleValue = ref("传统样式")
const contentValue = ref("1号楼")
const options = ref([
  {
    id: 1,
    value: "传统样式",
    label: "传统样式"
  },
  {
    id: 2,
    value: "美式样式",
    label: "美式样式"
  },
  {
    id: 3,
    value: "欧式样式",
    label: "欧式样式"
  }
])

const handleChange = (value: string) => {
  styleValue.value = value
}
const handleDraw = () => {
  GraphicDraw.commit("toggleTemperatureDraw")
  GraphicDraw.commit("setValue", styleValue.value)
  GraphicDraw.commit("setcontentValue", contentValue.value)
}

</script>

<style scoped lang="less">
.graphic-wrapper {
  width: 100%;
  height: 25vh;
  background-color: #888888;
  display: flex;
  flex-direction: column;
  color: white;
  padding-left: 1.5vw;

  .header-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .content-wrapper {
    flex: 2;
    display: flex;
    flex-direction: column;

    .wrapper1,
    .wrapper2 {
      display: flex;
      align-items: center;
    }

    .wrapper2 {
      margin-top: 20px;
    }
  }

  .footer-wrapper {
    flex: 1;
    margin-left: 52px;
  }
}

</style>
