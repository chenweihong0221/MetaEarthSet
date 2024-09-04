<script setup lang="ts">
import { useStore } from "vuex"
import { mapKey, stateKey } from "@mars/pages/demo/module/store/store"

import { nextTick, ref, watch, watchEffect } from "vue"
import { TreeProps } from "ant-design-vue"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { Building } from "../module/model/Building"

const store = useStore(mapKey)
const stateStore = useStore(stateKey)

const leftBarTreeData = ref<TreeProps["treeData"]>([])
let selectedGraphicId = ""
let selectedGraphicType = 0
const graphicIdTypeMap = new Map<string, number>()
const showGraphicIdSet = new Set<string>()
const showKeys = ref<string[]>([])


watchEffect(() => {
  console.log("left bar tree update!")
  graphicIdTypeMap.clear()
  const value = stateStore.state.leftBarNeedUpdate
  if (!value) {
    return
  }
  const treeData = []
  Array.from(store.state.buildingMap.values()).map(building => {
    graphicIdTypeMap.set(building.id, 0)
    return {
      title: building.name,
      key: building.id,
      type: 0,
      children: Array.from(building.floors.values()).map(floor => {
        graphicIdTypeMap.set(floor.id, 1)
        return {
          title: floor.name,
          key: floor.id,
          type: 1,
          children: Array.from(floor.spaces.values()).map(space => {
            graphicIdTypeMap.set(space.id, 2)
            return {
              title: space.name,
              key: space.id,
              type: 2
            }
          })
        }
      })
    }
  }).forEach((building) => treeData.push(building))

  // 处理围栏

  Array.from(store.state.fenceMap.values()).map(fence => {
    graphicIdTypeMap.set(fence.id.toString(), 3)
    return {
      title: fence.name,
      key: fence.id.toString(),
      type: 3
    }
  }).forEach((fence) => treeData.push(fence))

  // 处理露天场所

  Array.from(store.state.openAirMap.values()).map(openAir => {
    graphicIdTypeMap.set(openAir.id, 4)
    return {
      title: openAir.name,
      key: openAir.id,
      type: 4
    }
  }).forEach((openAir) => treeData.push(openAir))

  // 处理图上绘标

  Array.from(store.state.graphicDrawMap.values()).map(graphicDraw => {
    graphicIdTypeMap.set(graphicDraw.id.toString(), 5)
    return {
      title: graphicDraw.name,
      key: graphicDraw.id.toString(),
      type: 5
    }
  }).forEach((graphicDraw) => treeData.push(graphicDraw))



  // 处理人员模型

  Array.from(store.state.humanMap.values()).map(human => {
    graphicIdTypeMap.set(human.id.toString(), 6)
    return {
      title: human.id.toString(),
      key: human.id.toString(),
      type: 6
    }
  }).forEach((human) => treeData.push(human))

  // 处理监控设备

  Array.from(store.state.cameraMap.values()).map(camera => {
    graphicIdTypeMap.set(camera.id.toString(), 7)
    return {
      title: camera.id.toString(),
      key: camera.id.toString(),
      type: 7
    }
  }).forEach((camera) => treeData.push(camera))


  leftBarTreeData.value = treeData
  console.log("treeData", treeData)
  stateStore.commit("updateLeftBarNeedUpdate", false)
})
watch(leftBarTreeData, () => {
  for (const id of graphicIdTypeMap.keys()) {
    showGraphicIdSet.add(id)
  }
  nextTick(() => {
    showKeys.value = Array.from(showGraphicIdSet)
  })
})


const handleSelected: TreeProps["onSelect"] = (selectedKeys, info) => {

  if (selectedKeys.length === 0) {
    stateStore.commit("updateSelectedGraphicId", "")
    selectedGraphicId = ""
    return
  }
  if (selectedGraphicId !== "") {
    const graphic = store.getters.getGraphicByIdAndType(selectedGraphicId, selectedGraphicType)
    // graphic.removeHighLight()
  }

  const graphic: GraphicInterface = store.getters.getGraphicByIdAndType(selectedKeys[0], info.node.dataRef.type)
  selectedGraphicId = selectedKeys[0].toString()
  selectedGraphicType = info.node.dataRef.type
  graphic.highLight()
  stateStore.commit("updateSelectedGraphicId", selectedKeys[0])
  stateStore.commit("updateSelectedGraphicType", info.node.type)
}

const handleRightClick: TreeProps["onRightClick"] = (info) => {
  const graphic = getGraphicById(info.node.dataRef.key)
  graphic.flyTo()
}

const handleCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
  const id = info.node.dataRef.key.toString()
  const show = !showGraphicIdSet.has(id)
  const type = info.node.dataRef.type

  getGraphicById(id).setShow(show)
  if (show) {
    // 针对于type为0，1的情况，需要处理子节点
    showGraphicIdSet.add(id)
    if (type === 0) {
      const children = info.node.children
      children.forEach((child: any) => {
        showGraphicIdSet.add(child.key)
        getGraphicById(child.key).setShow(true)
        child.children.forEach((grandChild: any) => {
          showGraphicIdSet.add(grandChild.key)
          getGraphicById(grandChild.key).setShow(true)
        })
      })
    }
    if (type === 1) {
      const children = info.node.children
      children.forEach((child: any) => {
        showGraphicIdSet.add(child.key)
        getGraphicById(child.key).setShow(true)
      })
    }
  } else {
    showGraphicIdSet.delete(id)
    if (type === 0) {
      const children = info.node.children
      children.forEach((child: any) => {
        showGraphicIdSet.delete(child.key)
        getGraphicById(child.key).setShow(false)
        child.children.forEach((grandChild: any) => {
          showGraphicIdSet.delete(grandChild.key)
          getGraphicById(grandChild.key).setShow(false)
        })
      })
    }
    if (type === 1) {
      const children = info.node.children
      children.forEach((child: any) => {
        showGraphicIdSet.delete(child.key)
        getGraphicById(child.key).setShow(false)
      })
    }
  }
  showKeys.value = Array.from(showGraphicIdSet)
}

const getGraphicById = (id: string | number) => {
  let idStr = ""
  if (typeof id === "string") {
    idStr = id
  } else {
    idStr = id.toString()
  }
  return store.getters.getGraphicByIdAndType(idStr, graphicIdTypeMap.get(idStr))
}

</script>
<template>
  <div class="border" style="position: absolute; top: 4em;  width: 15em; height: 100%; background: #555555">
    <div class="container">
      <a-tree :show-icon="true" :show-line="false" :block-node="true" v-model:checked-keys="showKeys"
              :checkable="true" :tree-data="leftBarTreeData" @check="handleCheck" :check-strictly="true"
              @select="handleSelected" @rightClick="handleRightClick">
        <template #icon="dataRef">
          <align-center-outlined v-show="dataRef.type === 0" />
          <pic-center-outlined v-show="dataRef.type === 1" />
          <pic-left-outlined v-show="dataRef.type === 2" />
          <gateway-outlined v-show="dataRef.type === 3" />
          <expand-outlined v-show="dataRef.type === 4" />
          <form-outlined v-show="dataRef.type === 5" />
          <user-outlined v-show="dataRef.type === 6" />
          <video-camera-outlined v-show="dataRef.type === 7" />
        </template>
      </a-tree>
    </div>

    <!--    <div class="items-container">-->
    <!--      <a-collapse v-for="building in store.state.buildingMap.values()"-->
    <!--                  :key="building.id"-->
    <!--                  :bordered="false"-->


    <!--      >-->
    <!--        <a-collapse-panel :header="building.name"-->
    <!--                          @click="handleSelected(building.id, 0, $event)"-->
    <!--                          @mouseout="handleMouseOut(building.id, 0, $event)"-->
    <!--                          >-->
    <!--          <a-collapse v-for="floor in building.floors.values()"-->
    <!--                      :key="floor.id" :bordered="false" class="floor-box">-->
    <!--            <a-collapse-panel :header="floor.name" @click="handleSelected(floor.id, 1, $event)">-->
    <!--              <div v-for="space in floor.spaces.values()" :key="space.id" class="space-box"-->
    <!--                   @click="handleSelected(space.id, 2, $event)"-->
    <!--                   @mouseout="handleMouseOut(space.id, 2, $event)"-->
    <!--              >-->
    <!--                {{ space.name }}-->
    <!--              </div>-->
    <!--            </a-collapse-panel>-->
    <!--          </a-collapse>-->
    <!--        </a-collapse-panel>-->
    <!--      </a-collapse>-->
    <!--      <div class="fence-box" v-for="fence in store.state.fenceMap.values()" :key="fence.id"-->
    <!--           @click="handleSelected(fence.id, 3, $event)" @mouseout="handleMouseOut(fence.id, 3, $event)">-->
    <!--        {{ fence.name }}-->
    <!--      </div>-->
    <!--      <div class="openAir-box" v-for="openAir in store.state.openAirMap.values()" :key="openAir.id"-->
    <!--           @click="handleSelected(openAir.id, 4, $event)" @mouseout="handleMouseOut(openAir.id, 4, $event)">-->
    <!--        {{ openAir.name }}-->
    <!--      </div>-->
    <!--      <div class="graphic-draw-box" v-for="graphicDraw in store.state.graphicDrawMap.values()" :key="graphicDraw.id"-->
    <!--            @click="handleSelected(graphicDraw.id, 5, $event)" @mouseout="handleMouseOut(graphicDraw.id, 5, $event)">-->
    <!--          {{ graphicDraw.name }}-->
    <!--      </div>-->
    <!--      <div class="human-box" v-for="human in store.state.humanMap.values()" :key="human.id"-->
    <!--           @click="handleSelected(human.id, 6, $event)" @mouseout="handleMouseOut(human.id, 6, $event)">-->
    <!--        {{human.id}}-->
    <!--      </div>-->
    <!--    </div>-->

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
.openAir-box,
.graphic-draw-box,
.human-box {
  padding: 1em 3em;
  color: #ffffff;
  background: #4d4d4d;
  border-radius: 2px;
}

.space-box:hover,
.fence-box:hover,
.ant-collapse-header:hover,
.openAir-box:hover,
.graphic-draw-box:hover,
.human-box:hover {
  background: #666666;
  cursor: pointer;
}

.floor-box {
  margin-left: 1em;
}


.container {
  width: 14em;
}


</style>
