<script setup lang="ts">
import { useStore } from "vuex"
import { mapKey, stateKey } from "@mars/pages/demo/module/store"

const store = useStore(mapKey)
const stateStore = useStore(stateKey)
const handleSelected = (key: string, type?:number) => {
  stateStore.commit("updateSelectedGraphicId", key)
  console.log("selectedGraphicId:", key)
}

</script>
<template>
  <div class="border" style="position: absolute; top: 4em;  width: 15em; height: 100%; background: #555555">
    <div class="items-container">
      <a-collapse v-for="building in store.state.buildingMap.values()" :key="building.id" :bordered="false">
        <a-collapse-panel :header="building.name">
          <a-collapse v-for="floor in building.floors.values()"
                      :key="floor.id" :bordered="false" class="floor-box">
            <a-collapse-panel :header="floor.name" @click="handleSelected(floor.id, 1)">
              <div v-for="space in floor.spaces.values()" :key="space.id" class="space-box" @click="handleSelected(space.id, 2)">
                {{space.name }}
                </div>
            </a-collapse-panel>
          </a-collapse>
          <a-collapse v-for="floor in building.floors.values()" :key="floor.id" :bordered="false" class="floor-box">
            <a-collapse-panel :header="floor.name" @click="handleSelected(floor.id)">
              <div v-for="space in floor.spaces.values()" :key="space.id" class="space-box"
                @click="handleSelected(space.id)">
                {{ space.name }}
              </div>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
      </a-collapse>
      <div class="openAir-box" v-for="openAir in store.state.openAirMap.values()" :key="openAir.id"
        @click="handleSelected(openAir.id)">
        {{ openAir.name }}
      </div>
      <div class="fence-box" v-for="fence in store.state.fenceMap.values()" :key="fence.id"
        @click="handleSelected(fence.id)">
        {{ fence.name }}
      </div>
    </div>
    <div>

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
