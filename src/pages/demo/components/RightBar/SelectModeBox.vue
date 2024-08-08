<script setup lang="ts">

</script>

<template>
  <div class="wrapper">
    <a-collapse>
      <a-collapse-panel header="变换" key="1">
        <div class="trans-box">
          <div class="trans-row">
            位置： <div>x <input></div> <div>y <input></div> <div>z <input></div>
          </div>
          <div class="trans-row">
            旋转： <div>x <input></div> <div>y <input></div> <div>z <input></div>
          </div>
          <div class="trans-row">
            缩放： <div>x <input></div> <div>y <input></div> <div>z <input></div>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <a-collapse>
      <a-collapse-panel header="信息" key="2">

      </a-collapse-panel>
    </a-collapse>
    <a-collapse>
      <a-collapse-panel header="材质" key="3">

      </a-collapse-panel>
    </a-collapse>
    <a-collapse>
      <a-collapse-panel header="图上标绘" key="4">

      </a-collapse-panel>
    </a-collapse>
    <a-collapse>
      <a-collapse-panel header="其他" key="5">

      </a-collapse-panel>
    </a-collapse>
  </div>

</template>

<style scoped lang="less">
 .trans-row {

 }
</style>
