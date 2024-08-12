<script setup lang="ts">
import { useStore } from "vuex"
import { mapKey, stateKey } from "@mars/pages/demo/module/store"

const store = useStore(mapKey)
const stateStore = useStore(stateKey)
const handleSelected = (key: string, type: number, event: Event) => {
  stateStore.commit("updateSelectedGraphicId", key)
  stateStore.commit("updateSelectedGraphicType", type)
  console.log("selectedGraphicId:", key, type)
  // 阻止事件冒泡
  event.stopPropagation()
}

</script>
<template>
  <div class="border" style="position: absolute; top: 4em;  width: 15em; height: 100%; background: #555555">
    <div class="items-container">
      <a-collapse v-for="building in store.state.buildingMap.values()"
                  :key="building.id"
                  :bordered="false"
      >
        <a-collapse-panel :header="building.name" @click="handleSelected(building.id, -1, $event)">
          <a-collapse v-for="floor in building.floors.values()"
                      :key="floor.id" :bordered="false" class="floor-box">
            <a-collapse-panel :header="floor.name" @click="handleSelected(floor.id, 1, $event)">
              <div v-for="space in floor.spaces.values()" :key="space.id" class="space-box" @click="handleSelected(space.id, 2, $event)">
                {{ space.name }}
              </div>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
      </a-collapse>
      <div class="fence-box" v-for="fence in store.state.fenceMap.values()" :key="fence.id" @click="handleSelected(fence.id, 3, $event)">
        {{ fence.name }}
        <div class="openAir-box" v-for="openAir in store.state.openAirMap.values()" :key="openAir.id"
             @click="handleSelected(openAir.id, 4, $event)">
          {{ openAir.name }}
        </div>
      </div>
      <div class="openAir-box" v-for="openAir in store.state.openAirMap.values()" :key="openAir.id"
           @click="handleSelected(openAir.id, 4, $event)">
        {{ openAir.name }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.border {
  display: flex;
  justify-content: center;
}

.items-container {
  width: 90%;

}

.space-box,
.fence-box,
.openAir-box {
  padding: 1em 3em;
  color: #ffffff;
  background: #4d4d4d;
  border-radius: 2px;
}

.space-box:hover,
.fence-box:hover,
.ant-collapse-header:hover,
.openAir-box:hover {
  background: #666666;
  cursor: pointer;
}

.floor-box {
  margin-left: 1em;
}
</style>
