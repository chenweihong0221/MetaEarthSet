import "mars3d-cesium/Build/Cesium/Widgets/widgets.css"
import "mars3d-cesium"

import "mars3d/dist/mars3d.css"
import "mars3d"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@mars/common/store/widget"
import { store as testStore, key as testKey } from "@mars/common/store/test"
import store from "./widget-store"
import MarsUI from "@mars/components/mars-ui"
import { router } from "./routes"
import "@mars/components/mars-ui/common"
import { mapKey, mapStore, stateKey, stateStore } from "@mars/pages/meta/module/store/store"

// 导入全局样式
import "./style/main.css"

const app = createApp(Application)

app.use(MarsUI)

app.use(router)
// 这里是火星3d的store
app.use(injectState(store), key)
app.use(testStore, testKey)
// 这里是自定义的store
app.use(mapStore, mapKey)
app.use(stateStore, stateKey)
app.mount("#app")


