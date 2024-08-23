// axios配置
import axios from "axios"
import message from "ant-design-vue"
import { ModelData } from "@mars/pages/demo/api/adopter"

export const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Ahj_token: "8c4efc5e-ff3b-4268-966f-e2f7aac19e7c",
    Authorization: "Bearer 896baa83-2dcd-4680-bc10-b4e9d10020d5"
  },
})

instance.interceptors.request.use(
  (config) => {
    message.loading("加载中...", 0)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    message.destroy()
    return response
  },
  (error) => {
    message.destroy()
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


export function addModel(modelData: ModelData) {
  return instance.post("/xay/v1/sys/district/save", modelData)
}

export function updateModel(modelData: ModelData) {
  return instance.post("/xay/v1/sys/district/update", modelData)
}


export function deleteModel(id: string) {
  return instance.delete("/xay/v1/sys/district/del?id="+id)
}
