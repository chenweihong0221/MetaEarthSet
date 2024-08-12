import * as mars3d from "mars3d"
import { Cesium, LngLatPoint } from "mars3d"
import * as uuid from "uuid"
import { useStore } from "vuex"
import { mapStore } from "@mars/pages/demo/module/store"

function getHeight(positions: Cesium.Cartesian3[] | Cesium.Cartesian3): number {
  const position = positions instanceof Array ? positions[0] : positions
  const cartographic = Cesium.Cartographic.fromCartesian(position)
  return cartographic.height
}


function setHeight(positions: Cesium.Cartesian3[], height: number): Cesium.Cartesian3[] {
  return positions.map((position) => {
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    cartographic.height = height
    return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
  })
}

export class Building {
  id: string
  name: string
  floorNumber: number
  floorHeight: number
  spaceHeight: number
  floorInterval: number


  // eslint-disable-next-line no-use-before-define
  floors: Map<string, Floor>// 楼层对象
  positions: Cesium.Cartesian3[] // 平面对象
  layer: mars3d.layer.GraphicLayer

  constructor(layer: mars3d.layer.GraphicLayer,
              positions: Cesium.Cartesian3[],
              name?: string,
              floorNumber?: number,
              floorHeight?: number,
              spaceHeight?: number,
              autoCreateFloor = true) {
    this.id = uuid.v4()
    this.positions = positions
    this.name = name || "建筑物"
    this.floorNumber = floorNumber || 3
    this.floorHeight = floorHeight || 5
    this.spaceHeight = spaceHeight || 3
    this.floorInterval = 0.5
    this.layer = layer
    this.floors = new Map()
    let i = 0
    if (!autoCreateFloor) {
      return
    }
    while (i < this.floorNumber) {
      const newPosition: Cesium.Cartesian3 | Cesium.Cartesian3[] = mars3d.PointUtil.addPositionsHeight(positions, i * (this.floorHeight + this.floorInterval))
      this.addFloor(newPosition, `第 ${i + 1} 层`, i + 1)
      i++
    }
  }

  addFloor(position: Cesium.Cartesian3 | Cesium.Cartesian3[], name: string, floorNo: number, height?: number): Floor {
    const newFloorAlt = this._getNewFloorAlt()
    const newFloor = new Floor(position, this, name, floorNo, height, newFloorAlt)
    this.floors.set(newFloor.id.toString(), newFloor)
    return newFloor
  }

  toJSONObject(): any {
    // 先将floors转为数组
    const floors = Array.from(this.floors.values())
    return {
      id: this.id,
      name: this.name,
      floorNumber: this.floorNumber,
      floorHeight: this.floorHeight,
      spaceHeight: this.spaceHeight,
      floors,
      positions: this.positions
    }
  }

  _getNewFloorAlt(): number {
    let alt = 0
    this.floors.forEach((floor: Floor) => {
      alt += floor.alt
    })
    return alt
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
    const buildings = buildingArr.map(item => item.toJSONObject())
    return JSON.stringify(buildings)
  }

  static fromJSONArray(json: string, layer: mars3d.layer.GraphicLayer): Building[] {
    const obj = JSON.parse(json)
    const buildings: Building[] = []
    console.log(obj)
    obj.forEach((item: any) => {
      const building = new Building(layer, item.positions, item.name, item.floorNumber, item.floorHeight, item.spaceHeight,
        false)
      item.floors.forEach((floor: Floor) => {
        // handle floor
        console.log("floor created", floor)
        const newFloor = new Floor(floor.polygon.positionsShow, building, floor.name, floor.floorNo)
        newFloor.spaceNumber = floor.spaceNumber
        // TODO: spaces 这部分有较大改动，择日修复
        // floor.spaces.forEach((space: mars3d.graphic.PolygonEntity) => {
        //   // handle space
        //   const newSpace = new mars3d.graphic.PolygonEntity({
        //     positions: space.positions,
        //     name: space.name,
        //     style: {
        //       color: "#10acac",
        //       opacity: 0.8,
        //       // outline: true,
        //       diffHeight: building.spaceHeight
        //       // outlineColor: "#ffffff",
        //       // outlineWidth: 2
        //     }
        //   })
        //   newFloor.addSpace(space.positions)
        //   building.layer.addGraphic(newSpace)
        // })
        building.floors.set(newFloor.polygon.id.toString(), newFloor)
        console.log("building add a floor", newFloor)
      })
      console.log("building floors", building.floors)
      buildings.push(building)
    })
    console.log(buildings)
    return buildings
  }


}

export class Floor {
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

  constructor(positions: Cesium.Cartesian3 | Cesium.Cartesian3[], parent: Building, name: string, floorNo: number, height?: number, alt?: number) {
    this.id = uuid.v4()
    this.name = name
    this.positions = positions instanceof Array ? positions : [positions]
    this.layer = parent.layer
    this.height = height || parent.spaceHeight
    this.spaceNumber = 0
    this.spaces = new Map()
    this.floorNo = floorNo
    this.alt = getHeight(this.positions)

    // 创建底面和墙体
    this.polygon = new mars3d.graphic.PolygonEntity({
      positions: this.positions,
      name,
      style: {
        // color: "#5ec2e1",
        color: "#647BB1", // modify by cwh 202408081127
        opacity: 1
        // outline: true,
        // diffHeight: this.height
        // outlineColor: "#ffffff",
        // outlineWidth: 2
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
  }

  /**
   * 传入多边形的顶点坐标，生成空间
   * @param positions 多边形的顶点坐标
   * @param name 空间名称
   * @param height
   */
  addSpace(positions?: Cesium.Cartesian3[], name?: string, height?: number): Space {
    // 设置postions的高度和楼层高度一致
    const newPositions = setHeight(positions, this.alt + 1)
    const space = new Space(newPositions, this, name, height)
    this.spaces.set(space.id, space)
    return space
  }

}

export class Space {
  id: string
  name: string
  height: number
  parent: Floor
  polygon: mars3d.graphic.PolygonEntity
  wall: mars3d.graphic.ThickWall

  constructor(positions: Cesium.Cartesian3[], parent: Floor, name?: string, height?: number) {
    this.id = uuid.v4()
    this.name = name || "空间"
    this.height = height || 1.5
    this.parent = parent
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
}



export class Fence {
  id: string
  polygon: mars3d.graphic.ScrollWall
  height: number
  name: string

  constructor(positions: Cesium.Cartesian3[] | LngLatPoint[], name?:string, height?: number) {
    this.height = height || 30
    this.name = name || "围栏"
    this.polygon = new mars3d.graphic.ScrollWall({
      positions,
      name: name || "围栏",
      style: {
        materialType: mars3d.MaterialType.WallScroll,
        diffHeight: this.height,
        materialOptions: {
          color: "#d75ee1",
          count: 3,
          speed: 20,
          bloom: true
        },
        opacity: 0.8
      }
    })
    this.id = this.polygon.id.toString()
  }
}
