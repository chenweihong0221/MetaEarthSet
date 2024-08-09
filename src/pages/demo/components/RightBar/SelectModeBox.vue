<script setup lang="ts">
import { ref } from "vue"
import MarsButton from "@mars/components/mars-ui/mars-button/index.vue"
import GraphicDraw from "@mars/pages/demo/module/GraphicDrawStore"

const checked = ref(false)
const selectedState = ref("1")

const handleDraw = () => {
  GraphicDraw.commit("toggleCameraDraw")
}

</script>

<template>
  <div class="wrapper">
    <div class="trans-panel">
      <a-collapse>
        <a-collapse-panel header="变换" key="1">
          <div class="trans-box">
            <div class="trans-row">
              位置：
              <div>x <input></div>
              <div>y <input></div>
              <div>z <input></div>
            </div>
            <div class="trans-row">
              旋转：
              <div>x <input></div>
              <div>y <input></div>
              <div>z <input></div>
            </div>
            <div class="trans-row">
              缩放：
              <div>x <input></div>
              <div>y <input></div>
              <div>z <input></div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em"/>
    <div class="msg-panel">
      <a-collapse>
        <a-collapse-panel header="信息" key="2">
          <div class="msg-box">
            <div class="msg-row">
              <div class="msg-name">名称：</div>
              <input class="msg-name-input">
            </div>
            <div class="msg-row">
              <div class="msg-name">类型：</div>
              <div>网格</div>
            </div>
            <div class="msg-row">
              <div class="msg-name">显示：</div>
              <div><a-checkbox v-model:checked="checked"/></div>
            </div>
          </div>

        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em"/>
    <div class="material-panel">
      <a-collapse>
        <a-collapse-panel header="材质" key="3">
          <div class="material-box">
            <div class="material-row">
              <div>名称：&nbsp;&nbsp;</div>
              <input class="material-input">
            </div>
            <div class="material-row">
              <div>材质流：</div>
              <a-select v-model:value="selectedState" style="left: 10px; color: white; rgba(35, 39, 47, 0.7);!important;"
                        class="c_mars-select" popupClassName="mars-select-dropdown" >
                <a-select-option key="1">
                  材质1
                </a-select-option>
                <a-select-option key="2">
                  材质2
                </a-select-option>
                <a-select-option key="3">
                  材质3
                </a-select-option>
                <a-select-option key="4">
                  材质4
                </a-select-option>

              </a-select>
            </div>
            <div class="material-row">
              <div>颜色：&nbsp;&nbsp;</div>
              <input type="color" class="material-input-color" style="width: 2em; border: none; padding: 0" >
            </div>
            <div class="material-row">
              <div>贴图：&nbsp;&nbsp;</div>
              <input type="color" class="material-input-color" style="width: 2em; border: none; padding: 0">
            </div>
            <div class="material-row">
              <div>透明度：</div>
              <a-slider class="material-slider" :min="0" :max="1"  step="0.01" />
            </div>
            <div style="height: 2px"></div>
          </div>

        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em"/>
    <div class="draw-panel">
      <a-collapse>
        <a-collapse-panel header="图上标绘" key="4">
          <div class="draw-box">
            <div class="draw-row">
              <div>样式：</div>
              <a-select v-model:value="selectedState" style="left: 10px; color: white; rgba(35, 39, 47, 0.7);!important;"
                        class="c_mars-select" popupClassName="mars-select-dropdown" >
                <a-select-option key="1">
                  样式1
                </a-select-option>
                <a-select-option key="2">
                  样式2
                </a-select-option>
                <a-select-option key="3">
                  样式3
                </a-select-option>
                <a-select-option key="4">
                  样式4
                </a-select-option>

              </a-select>
            </div>
            <div class="draw-row">
              <div>内容：</div>
              <input class="draw-input">
            </div>
            <div class="draw-row">
              <div><mars-button class="my-button" @click="handleDraw">图上标绘</mars-button></div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div style="height: 3em"/>
    <div class="other-panel">
      <a-collapse>
        <a-collapse-panel header="其他" key="5">
          <div class="other-box">
            <div class="other-row">
              <div>设备ID：</div>
              <input class="other-input">
            </div>
            <div class="other-row">
              <mars-button class="my-button">监控设备</mars-button>
            </div>
            <div class="other-row">
              <div>人员ID： </div>
              <input class="other-input">
            </div>
            <div class="other-row">
              <mars-button class="my-button">监控人员</mars-button>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div style="height: 5em"/>
  </div>

</template>

<style scoped lang="less">
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center
}
.trans-panel, .msg-panel, .material-panel, .draw-panel, .other-panel {
  width: 90%;
  background: #999999;
  border-radius: 3px;
}

.trans-box, .msg-box, .material-box, .draw-box, .other-box {
  color: white;
  background: #999999;

}

.trans-row, .msg-row, .material-row, .draw-row , .other-row{
  display: flex;
  align-items: center;
  margin-left: 1em;
  height: 3em;
}

.msg-name {
  margin-right: 1em;
}

.msg-name-input {
  width: 10em
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

.draw-input, .other-input, .material-input {
  width: 15em;
  margin-right: auto;
}


.other-row .my-button{
  margin-left: 5em;
}

.ant-select-selector {
  background: #999999!important;
  border: 1px solid #999999!important;
  border-radius: 2px;
  color: white;
}


.c_mars-select {
  width: 14em;
  height: 32px;
  background-color: rgba(35, 39, 47, 0.7);;
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

.ant-slider-track {
  background-color: rgb(255, 255, 255);
}



</style>
