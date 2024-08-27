// axios配置
import axios from "axios"
import message from "ant-design-vue"
import { ModelData } from "@mars/pages/demo/api/adopter"

export const instance = axios.create({
  baseURL: "http://api.test01.platform.ahjtest.top",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 06f1e3cd-213f-48ce-ac94-cd180f5cf5bf"
  }
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export function post(url: string, data: any) {
  return instance.post(url, data)
}

export function get(url: string) {
  return instance.get(url)
}

export function deleteReq(url: string) {
  return instance.delete(url)
}

export function addModel(modelData) {
  return instance.post("/xay/v1/sys/district/save", modelData)
}

export function updateModel(modelData: ModelData) {
  return instance.post("/xay/v1/sys/district/update", modelData)
}

export function deleteModel(id: string) {
  return instance.delete("/xay/v1/sys/district/del?id=" + id)
}

export function getModel(param) {
  return instance.get("/xay/v1/sys/district/find-tree", param)
}

export function getThree() {
  return instance.get("/xay/v1/sys/district/find-second-level-tree")
}

export function getDetail(secondLevelDistrictId, currentDistrictId){
  return instance.get("/xay/v1/sys/district/find-tree-info/" + secondLevelDistrictId + "/" + currentDistrictId)
}
