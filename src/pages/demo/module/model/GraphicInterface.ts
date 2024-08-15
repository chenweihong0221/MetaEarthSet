
export interface GraphicInterface{
  id: string
  show: boolean

  setShow(show: boolean): void

  highLight(): void

  removeHighLight(): void

  flyTo(): void

}
