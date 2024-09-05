import * as mars3d from "mars3d"
import { Cesium, EventType } from "mars3d"
import { mapStore, stateStore } from "@mars/pages/meta/module/store/store"
import { useStore } from "vuex"
import { GraphicInterface } from "@mars/pages/meta/module/model/GraphicInterface"
import { ModelData } from "@mars/pages/meta/api/adopter"
import { castTo2DArr, convertToJSON } from "@mars/pages/meta/module/tool/position"
import { deleteModel, updateModel, getDetail } from "@mars/pages/meta/api/api"
import * as uuid from "uuid"
import { addModel } from "@mars/pages/meta/api/api"
import { message } from "ant-design-vue"
import { ref } from "vue"


function getHeight(positions: Cesium.Cartesian3[] | Cesium.Cartesian3): number {
  const position = positions instanceof Array ? positions[0] : positions
  const cartographic = Cesium.Cartographic.fromCartesian(position)
  return cartographic.height
}

export function setHeight(positions: Cesium.Cartesian3[], height: number): Cesium.Cartesian3[] {
  return positions.map((position) => {
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    cartographic.height = height
    return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
  })
}

const timer = ref(null)
const count = ref(0)
export class Building implements GraphicInterface {
  id: string
  name: string
  floorNumber: number
  floorHeight: number
  spaceHeight: number
  floorInterval: number

  // eslint-disable-next-line no-use-before-define
  floors: Map<string, Floor> // 楼层对象
  positions: Cesium.Cartesian3[] // 平面对象
  layer: mars3d.layer.GraphicLayer
  show: boolean = true

  constructor(
    layer: mars3d.layer.GraphicLayer,
    positions: Cesium.Cartesian3[] | { x: number; y: number; z: number }[],
    name?: string,
    floorNumber?: number,
    floorHeight?: number,
    spaceHeight?: number,
    autoCreateFloor = true,
    id?: string,
    api?: boolean
  ) {
    this.id = id || uuid.v4()
    if (positions !== undefined && positions !== null) {
      const firstPositionItem = positions[0]
      if (firstPositionItem instanceof mars3d.Cesium.Cartesian3) {
        this.positions = positions as Cesium.Cartesian3[]
      } else {
        this.positions = (positions as { x: number; y: number; z: number }[]).map((item) => {
          return Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)
        })
      }
    }
    this.name = name || "建筑物"
    this.floorNumber = floorNumber || 3
    this.floorHeight = floorHeight || 5
    this.spaceHeight = spaceHeight || 3
    this.floorInterval = 0.1
    this.layer = layer
    this.floors = new Map()
    if (!autoCreateFloor) {
      return
    }
    if (api === true) {
      // 先发送请求，再创建楼层
      const model = this.toModelData(stateStore.state.selectedAreaCode)
      addModel(model).then((res) => {
        // eslint-disable-next-line
        if (res.data.code === "0") {
          this.id = res.data.data.districtId
          // this.addFloors(res.data.data.code) // 后端以及默认新增5个楼层
          let i = 0
          while (i < this.floorNumber) {
            const newPosition: Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(
              this.positions,
              i * (this.floorHeight + this.floorInterval)
            ) as Cesium.Cartesian3[]
            const newFloor = new Floor(newPosition, this, `${i + 1} 层`, this.floorNumber, null, id, res.data.data.code, false)
            this.floors.set(newFloor.id.toString(), newFloor)
            i++
          }
          mapStore.commit("addBuilding", this)
          stateStore.commit("updateLeftBarNeedUpdate", true)
          message.success("新建楼栋成功")
        } else {
          message.error(res.data.msg)
        }
      })
    }
  }

  addFloors(code) {
    timer.value = setTimeout(() => {
      const newPosition: Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(
        this.positions,
        count.value * (this.floorHeight + this.floorInterval)
      ) as Cesium.Cartesian3[]
      count.value++
      this.addFloor(newPosition, `第 ${count.value} 层`, this.floorNumber, null, null, code) // 调用接口的方法
      if (count.value < this.floorNumber) {
        this.addFloors(code)
      } else {
        clearInterval(timer.value)
        count.value = 0
        stateStore.commit("updateLeftBarNeedUpdate", true)
      }
    }, 200)
  }

  addFloor(positions: Cesium.Cartesian3[], name: string, floorNo: number, height?: number, id?: string, code?: string): Floor {
    const newFloor = new Floor(positions, this, name, floorNo, height, id, code, true)
    this.floors.set(newFloor.id.toString(), newFloor)
    return newFloor
  }

  toJSONObject(): any {
    // 先将floors转为数组
    const floors = Array.from(this.floors.values())
    return {
      id: this.id,
      name: this.name,
      positions: this.positions,
      floorNumber: this.floorNumber,
      floorHeight: this.floorHeight,
      spaceHeight: this.spaceHeight,
      floors: floors.map((floor: Floor) => {
        return {
          id: floor.id,
          name: floor.name,
          floorNo: floor.floorNo,
          positions: floor.positions,
          spaces: Array.from(floor.spaces.values()).map((space: Space) => {
            return {
              id: space.id,
              name: space.name,
              positions: space.positions
            }
          })
        }
      })
    }
  }

  hideFloor() {
    this.floors.forEach((floor: Floor) => {
      floor.polygon.show = false
      floor.wall.show = false
      if (floor.spaces) {
        floor.spaces.forEach((space: Space) => {
          space.polygon.show = false
          space.wall.show = false
        })
      }
    })
  }

  onlyShowFirstFloor(): void {
    let isFirst = 0
    this.floors.forEach((floor: Floor) => {
      if (isFirst === 0) {
        floor.polygon.show = true
        floor.wall.show = false
        if (floor.spaces) {
          floor.spaces.forEach((space: Space) => {
            space.polygon.show = false
            space.wall.show = false
          })
        }
      } else {
        floor.polygon.show = false
        floor.wall.show = false
        if (floor.spaces) {
          floor.spaces.forEach((space: Space) => {
            space.polygon.show = false
            space.wall.show = false
          })
        }
      }
      isFirst++
    })
  }


  onlyShowFloor(id: string): void {

    this.floors.forEach((floor: Floor) => {
      if (floor.id.toString() === id) {
        floor.polygon.show = true
        floor.wall.show = true
        if (floor.spaces) {
          floor.spaces.forEach((space: Space) => {
            space.polygon.show = true
            space.wall.show = true
          })
        }
      } else {
        floor.polygon.show = false
        floor.wall.show = false
        if (floor.spaces) {
          floor.spaces.forEach((space: Space) => {
            space.polygon.show = false
            space.wall.show = false
          })
        }
      }
    })
  }

  showAllFloors(): void {
    this.floors.forEach((floor: Floor) => {
      floor.polygon.show = true
      floor.wall.show = true
      if (floor.spaces) {
        floor.spaces.forEach((space: Space) => {
          space.polygon.show = true
          space.wall.show = true
        })
      }
    })
  }

  getFirstFloor(): Floor | undefined {
    // 将 Map 转换为数组，并获取第一个元素
    const floorsArray = Array.from(this.floors.values())
    if (floorsArray.length > 0) {
      return floorsArray[0]
    }
    // 如果 Map 为空，则返回 undefined
    return undefined
  }

  updatePositions(positions: Cesium.Cartesian3[], api: boolean) {
    let i = 0
    this.positions = positions
    this.floors.forEach((floor: Floor) => {
      const newPosition: Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(
        this.positions,
        i * (this.floorHeight + this.floorInterval)
      ) as Cesium.Cartesian3[]
      floor.positions = positions
      floor.polygon.positions = newPosition
      floor.wall.positions = newPosition
      if (api) {
        timer.value = setTimeout(() => {
          const newPosition: Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(
            this.positions,
            i * (this.floorHeight + this.floorInterval)
          ) as Cesium.Cartesian3[]
          // 生成接口参数
          const pos = castTo2DArr(newPosition)
          const path = convertToJSON(pos)
          const params = {
            districtId: floor.id,
            path: path.toString(),
            longitudeAndLatitudeJson: path.toString()
          }
          // 调取修改接口
          updateModel(params).then((res) => {
            if (res.data.code === "0") {
              message.success(res.data.msg)
            } else {
              message.error(res.data.msg)
            }
          })
        }, 250)
      }
      i++
    })
    if (api) {
      clearInterval(timer.value)
    }
  }

  static arrayToJSON(buildingArr: Building[]): string {
    const buildings = buildingArr.map((item) => item.toJSONObject())
    return JSON.stringify(buildings)
  }

  static fromJSONArray(json: any, layer: mars3d.layer.GraphicLayer): Building[] {
    const buildings: Building[] = []
    json.forEach((item: any) => {
      const building = new Building(layer, item.positions, item.name, item.floorNumber, item.floorHeight, item.spaceHeight, false, item.id)
      buildings.push(building)
      item.floors.forEach((floor: any) => {
        const newFloor = building.addFloor(floor.positions, floor.name, floor.floorNo)
        floor.spaces.forEach((space: any) => {
          newFloor.addSpace(space.positions, space.name, null, space.id)
        })
      })
    })
    return buildings
  }

  // 如果show属性变为false，则隐藏建筑物
  setShow(show: boolean): void {
    this.show = show
    this.floors.forEach((floor: Floor) => {
      floor.setShow(show)
    })
  }

  highLight(): void {
    mapStore.state.outlineEffect.selected = Array.from(this.floors.values()).map((floor) => floor.wall)
  }

  removeHighLight(): void {
    mapStore.state.outlineEffect.selected = []
  }

  flyTo(): void {
    const firstFloor = this.floors.values().next().value
    mapStore.state.map.flyToGraphic(firstFloor.polygon)
  }

  toModelData(areaId: string): ModelData {
    if (areaId == null) {
      throw new Error("areaId is null")
    }
    const pos = castTo2DArr(this.positions)
    const position = mars3d.PolyUtil.centerOfMass(this.positions)
    const path = convertToJSON(pos)
    return new ModelData(areaId, this.id, this.name, path, position, 3, this.floorNumber)
  }

}

export class Floor implements GraphicInterface {
  id: string
  code: string
  name: string // 楼层名称
  positions: Cesium.Cartesian3[]
  polygon: mars3d.graphic.PolygonEntity // 底面图形
  wall: mars3d.graphic.ThickWall // 墙体模型
  // eslint-disable-next-line no-use-before-define
  spaces: Map<string, Space> // 空间对象
  parent: Building // 楼层所属的建筑
  layer: mars3d.layer.GraphicLayer
  height: number // 楼层高度
  spaceNumber: number // 空间数量
  floorNo: number // 楼层号
  alt: number // 楼层所在高度
  api: boolean
  show: boolean = true // 是否显示

  constructor(
    positions:
      | Cesium.Cartesian3[]
      | {
        x: number
        y: number
        z: number
      },
    parent: Building,
    name: string,
    floorNo: number,
    height?: number,
    id?: string,
    parentCode?: string,
    api?: boolean
  ) {
    this.id = id || uuid.v4()
    this.name = name
    this.api = api
    if (positions !== undefined && positions !== null) {
      if (positions[0] instanceof mars3d.Cesium.Cartesian3) {
        this.positions = positions as Cesium.Cartesian3[]
      } else {
        this.positions = (positions as { x: number; y: number; z: number }[]).map((item) => {
          return new Cesium.Cartesian3(item.x, item.y, item.z)
        })
      }
      this.alt = getHeight(this.positions)
    }
    this.layer = parent.layer
    this.height = height || parent.spaceHeight
    this.spaceNumber = 0
    this.spaces = new Map()
    this.floorNo = floorNo
    // 先发送请求，成功后再创建楼层
    if (api === true) {
      const model = this.toModelData()
      model.parentCode = parentCode
      addModel(model).then((res) => {
        if (res.data.code === "0") {
          this.id = res.data.data.districtId
          this.code = res.data.data.districtCode
        } else {
          message.error(res.data.msg)
        }
      })
    }

    this.polygon = new mars3d.graphic.PolygonEntity({
      positions: this.positions,
      name,
      style: {
        // color: "#5ec2e1",
        color: "#647BB1", // modify by cwh 202408081127
        opacity: 1
      }
    })
    this.wall = new mars3d.graphic.ThickWall({
      positions: this.positions,
      name,
      style: {
        // color: "#5ec2e1",
        color: "#647BB1", // modify by cwh 202408081127
        opacity: 1,
        diffHeight: this.height,
        width: 0.2,
        closure: true
      }
    })
    // this.layer.addGraphic(this.polygon)
    // this.layer.addGraphic(this.wall)
    window.drawGraphicLayer.addGraphic(this.polygon)
    window.drawGraphicLayer.addGraphic(this.wall)
    window.polygonWall.set(this.id, this.wall)
    window.polygonEntity.set(this.id, this.polygon)
  }

  /**
   * 传入多边形的顶点坐标，生成空间
   * @param positions 多边形的顶点坐标
   * @param name 空间名称
   * @param height 空间高度
   * @param id 空间id
   */
  addSpace(positions?: Cesium.Cartesian3[], name?: string, height?: number, id?: string): Space {
    // 设置postions的高度和楼层高度一致
    const newPositions = setHeight(positions, this.alt + 1)
    const space = new Space(newPositions, this, name, height, id, true)
    this.spaces.set(space.id, space)
    return space
  }

  setShow(show: boolean): void {
    this.show = show
    this.polygon.show = show
    this.wall.show = show
    this.spaces.forEach((space: Space) => {
      space.show = show
      space.polygon.show = show
      space.wall.show = show
    })
  }

  highLight(): void {
    mapStore.state.outlineEffect.selected = [this.wall]
  }

  removeHighLight(): void {
    mapStore.state.outlineEffect.selected = []
  }

  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.polygon)
  }

  toModelData(): ModelData {
    const pos = castTo2DArr(this.positions)
    const position = mars3d.PolyUtil.centerOfMass(this.positions)
    const path = convertToJSON(pos)
    return new ModelData(null, null, this.name, path, position, 4, this.floorNo)
  }

}

export class Space implements GraphicInterface {
  id: string
  name: string
  height: number
  parent: Floor
  positions: Cesium.Cartesian3[]
  polygon: mars3d.graphic.PolygonEntity
  wall: mars3d.graphic.ThickWall
  code: string
  show: boolean = true // 是否显示

  constructor(positions: Cesium.Cartesian3[], parent: Floor, name?: string, height?: number, id?: string, api?: boolean) {
    this.id = id || uuid.v4()
    this.name = name || "空间"
    this.height = height || 1.5
    this.parent = parent
    if (positions[0] instanceof mars3d.Cesium.Cartesian3) {
      this.positions = positions as Cesium.Cartesian3[]
    } else {
      this.positions = (positions as { x: number; y: number; z: number }[]).map((item) => {
        return Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)
      })
    }
    if (api) {
      const model = this.toModelData()
      addModel(model).then((res) => {
        if (res.data.code === "0") {
          this.id = res.data.data.districtId
          this.code = res.data.data.districtCode
          message.success("新增区域成功")
        } else {
          message.error(res.data.msg)
        }
      })
    }
    this.polygon = new mars3d.graphic.PolygonEntity({
      positions,
      name: name || "空间",
      style: {
        // color: "#be3aea",
        color: "#8D79C0", // modify by cwh 202408081127
        opacity: 1
      }
    })
    this.wall = new mars3d.graphic.ThickWall({
      positions,
      name: name || "空间",
      style: {
        // color: "#be3aea",
        color: "#8D79C0", // modify by cwh 202408081127
        opacity: 1,
        diffHeight: this.height,
        width: 0.1,
        closure: true
      }
    })
    this.parent.layer.addGraphic(this.polygon)
    this.parent.layer.addGraphic(this.wall)
  }

  setShow(show: boolean): void {
    this.show = show
    this.polygon.show = show
    this.wall.show = show
  }

  highLight(): void {
    mapStore.state.outlineEffect.selected = [this.wall]
  }

  removeHighLight(): void {
    mapStore.state.outlineEffect.selected = []
  }

  flyTo(): void {
    mapStore.state.map.flyToGraphic(this.polygon)
  }

  toModelData(): ModelData {
    const pos = castTo2DArr(this.positions)
    const position = mars3d.PolyUtil.centerOfMass(this.positions)
    const path = convertToJSON(pos)
    return new ModelData(this.parent.code, this.id, this.name, path, position, 5, null)
  }

}

