import { Accessor, Setter, createContext, createSignal, useContext } from "solid-js"

export class UIState {
  openedTask: Accessor<number | null>
  _setOpenedTask: Setter<number | null>
  
  constructor() {
    const [openedTask, setOpenedTask] = createSignal<number | null>(null)
    this.openedTask = openedTask
    this._setOpenedTask = setOpenedTask
    
    const rawStored = localStorage.getItem('uistate')
    
    if (rawStored) {
      const data = JSON.parse(rawStored)
      
      this._setOpenedTask(data.openedTask)
    }
  }

  setOpenedTask(value: number | null) {
    this._setOpenedTask(value)
    localStorage.setItem('uistate', JSON.stringify({
      openedTask: value,
    }))
  }
}

export const UIStateContext = createContext<UIState>()

export const useUIState = () => {
  const store = useContext(UIStateContext)
  
  if (!store) {
    console.error('Failed to load ui state')
  }
  
  return store!
}