// axios配置
import { ModelData } from "@mars/pages/demo/api/adopter"
import axios from "axios"

export const instance = axios.create({
  baseURL: "http://api.test01.platform.ahjtest.top",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 678881b5-5031-428e-96fc-6c1de2053e98"
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

export function deleteModel(id) {
  return instance.delete("/xay/v1/sys/district/del", { data: id })
}

export function getModel(param) {
  return instance.get("/xay/v1/sys/district/find-tree", param)
}

export function getThree() {
  return instance.get("/xay/v1/sys/district/find-second-level-tree")
}

export function getDetail(secondLevelDistrictId, currentDistrictId) {
  return instance.get("/xay/v1/sys/district/find-tree-info/" + secondLevelDistrictId + "/" + currentDistrictId)
}
