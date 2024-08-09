<template>
  <div class="other-wrapper">
    <div class="header-wrapper">
      <div style="display: flex;align-items: center">
        <div style="font-size: 30px;"> ></div>
        <div style="margin-left: 10px;font-size: 15px">材质</div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="wrapper1">
        <h1>名称: </h1>
        <a-space direction="vertical" style="margin-left: 9px">
          <a-input v-model:value="value" placeholder="Basic usage" size="small" style="width: 140px;margin-left: 20px"/>
        </a-space>
      </div>

      <div class="wrapper2">
        <h1>材质流:</h1>
        <div style="margin-left: 15px; font-size: 14px">
          <a-space>
            <a-select
              ref="select"
              v-model:value="value"
              style="width: 140px"
              :options="options"
              @focus="focus"
              @change="handleChange"
              size="small"
            ></a-select>
          </a-space>
        </div>
      </div>

<!--      <div class="wrapper3">-->
<!--        <h1>颜色: </h1>-->
<!--        <a-space direction="vertical" style="margin-left: 9px">-->
<!--          <a-input v-model:value="value" placeholder="Basic usage" size="small" style="width: 140px;margin-left: 20px"/>-->
<!--        </a-space>-->
<!--      </div>-->

<!--      <div class="wrapper4">-->
<!--        <h1>颜色: </h1>-->
<!--        <a-space direction="vertical" style="margin-left: 9px">-->
<!--          <a-input v-model:value="value" placeholder="Basic usage" size="small" style="width: 140px;margin-left: 20px"/>-->
<!--        </a-space>-->
<!--      </div>-->

<!--      <div class="wrapper5">-->
<!--        <h1>透明度: </h1>-->
<!--        <a-space direction="vertical" style="margin-left: 9px">-->
<!--          <a-input v-model:value="value" placeholder="Basic usage" size="small" style="width: 140px;margin-left: 20px"/>-->
<!--        </a-space>-->
<!--      </div>-->
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const value = ref()
const options = ref([
  {
    value: "jack",
    label: "jack"
  },
  {
    value: "lucy",
    label: "lucy"
  },
  {
    value: "disabled",
    label: "Disabled",
    disabled: true
  },
  {
    value: "yiminghe",
    label: "Yiminghe"
  }
])
const handleChange = (value: string) => {
  console.log(`selected ${value}`)
}
</script>

<style scoped lang="less">
.other-wrapper {
  width: 100%;
  height: 30vh;
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
    padding-bottom: 30px;

    .wrapper1,
    .wrapper2 {
      display: flex;
      align-items: center;
    }

    .wrapper2 {
      margin-top: 20px;
    }
  }
}

</style>
