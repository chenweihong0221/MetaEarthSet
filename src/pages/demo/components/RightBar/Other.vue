<template>
  <div class="other-wrapper">
    <div class="header-wrapper">
      <div style="display: flex;align-items: center">
        <div style="font-size: 30px;"> ></div>
        <div style="margin-left: 10px;font-size: 15px">其他</div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="wrapper1">
        <h1>设备ID: </h1>
        <a-space direction="vertical">
          <a-input v-model:value="value" placeholder="Basic usage" size="small" style="width: 140px;margin-left: 20px"/>
        </a-space>
      </div>
      <a-button size="small" style="width: 140px;margin-top: 20px;margin-left: 68px"
                @click="handleAddCamera"
      >监控设备</a-button>


      <div class="wrapper2">
        <h1>人员ID:</h1>
        <a-space direction="vertical">
          <a-input v-model:value="value" placeholder="Basic usage" size="small" style="width: 140px;margin-left: 20px"/>
        </a-space>
      </div>
      <a-button size="small" style="width: 140px;margin-top: 20px;margin-left: 68px">3D人员</a-button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import cameraDrawStore from "@mars/pages/demo/module/CameraStore"

const value = ref("其他")
const handleAddCamera = () => {
  console.log(value.value)
  cameraDrawStore.commit("toggleCameraDraw")
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
