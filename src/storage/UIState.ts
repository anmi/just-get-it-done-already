import { Accessor, Setter, createContext, createSignal, useContext } from "solid-js"

export class UIState {
  // private openedTask = createSignal<number | null>(null)
  
  openedTask: Accessor<number | null>
  setOpenedTask: Setter<number | null>
  
  constructor() {
    const [openedTask, setOpenedTask] = createSignal<number | null>(null)
    this.openedTask = openedTask
    this.setOpenedTask = setOpenedTask
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