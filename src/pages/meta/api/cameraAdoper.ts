import { Building, Floor } from "@mars/pages/meta/module/model/Building"
import { mapStore, stateStore } from "@mars/pages/meta/module/store/store"
import { GraphicInterface } from "@mars/pages/meta/module/model/GraphicInterface"
import { Cesium, LngLatPoint } from "mars3d"
import { Space } from "ant-design-vue"


const floorHeight = 5
const spaceHeight = 3
const fenceHeight = 5
const openAirHeight = 5


export interface Location {
    x: number
    y: number
    z: number
}

export class ModelData {
    current: number | null

    size?: number | null

    tenantId: string | null

    appId?: string | null

    deviceName: string | null

    deviceCode: string | null

    deviceModelIds: number[] | null

    deviceClassifyCode: string | null

    deviceStyle: string | null

    status: string | null

    districtCode: string | null

    constructor(
    ) { }
}
}
