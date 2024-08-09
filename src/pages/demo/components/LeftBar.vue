<script setup lang="ts">
import { useStore } from "vuex"
import { mapKey } from "@mars/pages/demo/module/store"


const store = useStore(mapKey)
</script>
<template>
  <div class="border" style="position: absolute; top: 4em;  width: 15em; height: 100%; background: #555555">
    <div class="items-container">
      <a-collapse v-for="building in store.state.buildingMap.values()"
                  :key="building.id"
                  :bordered="false"
      >
        <a-collapse-panel :header="building.name">
          <a-collapse v-for="floor in building.floors.values()" :key="floor.id" :bordered="false" class="floor-box">
            <a-collapse-panel :header="floor.name">
              <div v-for="space in floor.spaces.values()" :key="space.id" class="space-box">
                {{space.name }}
              </div>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
      </a-collapse>
    </div>

  </div>
</template>
<style scoped lang="less">
.border {
  display: flex;
  justify-content: center;
}
.items-container{
  width: 90%;

}
.space-box {
  padding:  1em 3em;
  color: #ffffff;
}
.floor-box {
  margin-left: 1em;
}
</style>
