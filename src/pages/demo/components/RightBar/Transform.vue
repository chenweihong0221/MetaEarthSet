<template>
  <div class="transform-wrapper">
    <div class="header-wrapper">
      <div style="display: flex;align-items: center">
        <div style="font-size: 30px;"> ></div>
        <div style="margin-left: 10px;font-size: 15px">变换</div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="wrapper1">
        <h1>位置: </h1>
        <div style="margin-left: 8px">
          x
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
          y
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
          z
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
        </div>
      </div>

      <div class="wrapper2">
        <h1>旋转: </h1>
        <div style="margin-left: 8px">
          x
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
          y
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
          z
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
        </div>
      </div>

      <div class="wrapper3">
        <h1>缩放: </h1>
        <div style="margin-left: 8px">
          x
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
          y
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
          z
          <a-input v-model:value="value" style="width: 50px;" size="small"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const value = ref()
</script>


<style scoped lang="less">
.transform-wrapper {
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

    .wrapper1,
    .wrapper2,
    .wrapper3 {
      display: flex;
      align-items: center;
    }

    .wrapper2,
    .wrapper3 {
      margin-top: 20px;
    }
  }
}

</style>
