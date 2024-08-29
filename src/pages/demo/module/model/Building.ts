import * as mars3d from "mars3d"
import { Cesium, EventType } from "mars3d"
import { mapStore, stateStore } from "@mars/pages/demo/module/store/store"
import { useStore } from "vuex"
import { GraphicInterface } from "@mars/pages/demo/module/model/GraphicInterface"
import { ModelData } from "@mars/pages/demo/api/adopter"
import { castTo2DArr } from "@mars/pages/demo/module/tool/position"
import * as uuid from "uuid"
import { addModel } from "@mars/pages/demo/api/api"
import { message } from "ant-design-vue"


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
    let i = 0
    if (!autoCreateFloor) {
      return
    }
    if (api === true) {
      // 先发送请求，再创建楼层
      const model = this.toModelData(stateStore.state.selectedAreaId)
      addModel(model).then((res) => {
        // eslint-disable-next-line 
        console.log(res)
        this.id = res.data.data.districtId
        let timer;
        if (res.data.code === "0") {
          while (i < this.floorNumber) {
            const newPosition: Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(
              this.positions,
              i * (this.floorHeight + this.floorInterval)
            ) as Cesium.Cartesian3[]
            i++
            timer = setInterval(() => {
              this.addFloor(newPosition, `第 ${i + 1} 层`, i + 1, null, null, res.data.data.code) // 调用接口的方法
            }, 1000)
          }
          clearInterval(timer);
          console.log(this)
          mapStore.commit("addBuilding", this)
          stateStore.commit("updateLeftBarNeedUpdate", true)
          message.success("新建楼栋成功")
        } else {
          // message.error(res.data.msg)
        }
      })
    }

  }

  addFloor(positions: Cesium.Cartesian3[], name: string, floorNo: number, height?: number, id?: string, code?: string): Floor {
    const newFloor = new Floor(positions, this, name, floorNo, height, id, code)
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

  onlyShowFloor(floorNo: string): void {
    this.floors.forEach((floor: Floor) => {
      if (floor.floorNo.toString() === floorNo) {
        floor.polygon.show = true
        floor.wall.show = true
        floor.spaces.forEach((space: Space) => {
          space.polygon.show = true
          space.wall.show = true
        })
      } else {
        floor.polygon.show = false
        floor.wall.show = false
        floor.spaces.forEach((space: Space) => {
          space.polygon.show = false
          space.wall.show = false
        })
      }
    })
  }

  showAllFloors(): void {
    this.floors.forEach((floor: Floor) => {
      floor.polygon.show = true
      floor.wall.show = true
      floor.spaces.forEach((space: Space) => {
        space.polygon.show = true
        space.wall.show = true
      })
    })
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
    return new ModelData(areaId, this.id, this.name, pos, position, 3, this.floorNumber)
  }
}

export class Floor implements GraphicInterface {
  id: string
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
    parentCode?: string
  ) {
    this.id = id || uuid.v4()
    this.name = name
    if (positions[0] instanceof mars3d.Cesium.Cartesian3) {
      this.positions = positions as Cesium.Cartesian3[]
    } else {
      this.positions = (positions as { x: number; y: number; z: number }[]).map((item) => {
        return new Cesium.Cartesian3(item.x, item.y, item.z)
      })
    }
    this.layer = parent.layer
    this.height = height || parent.spaceHeight
    this.spaceNumber = 0
    this.spaces = new Map()
    this.floorNo = floorNo
    this.alt = getHeight(this.positions)
    // 先发送请求，成功后再创建楼层
    const model = this.toModelData()
    model.parentCode = parentCode
    addModel(model).then((res) => {
      if (res.data.code === "0") {
        // 创建底面和墙体
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
        this.layer.addGraphic(this.polygon)
        this.layer.addGraphic(this.wall)
      } else {
        message.error(res.data.msg)
      }
    })
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
    const space = new Space(newPositions, this, name, height, id)
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
    return new ModelData(null, null, this.name, pos, position, 4, this.floorNo)
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

  show: boolean = true // 是否显示

  constructor(positions: Cesium.Cartesian3[], parent: Floor, name?: string, height?: number, id?: string) {
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
    const model = this.toModelData()
    addModel(model).then((res) => {
      if (res.data.code === "0") {
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
      } else {
        message.error(res.data.msg)
      }
    })
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
    return new ModelData(this.parent.id, this.id, this.name, pos, position, 3, this.parent.floorNo)
  }
}

