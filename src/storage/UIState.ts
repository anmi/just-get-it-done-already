import { Accessor, Setter, createContext, createSignal, useContext } from "solid-js"

export class UIState {
  openedTask: Accessor<number | null>
  _setOpenedTask: Setter<number | null>
  goalTask: Accessor<number | null>
  _setGoalTask: Setter<number | null>
  
  constructor() {
    const [openedTask, setOpenedTask] = createSignal<number | null>(null)
    this.openedTask = openedTask
    this._setOpenedTask = setOpenedTask
    const [goalTask, setGoalTask] = createSignal<number | null>(null)
    this._setGoalTask = setGoalTask
    this.goalTask = goalTask
    
    const rawStored = localStorage.getItem('uistate')
    
    if (rawStored) {
      const data = JSON.parse(rawStored)
      
      this._setOpenedTask(data.openedTask)
      this._setGoalTask(data.goalTask)
    }
  }
  
  saveState() {
    localStorage.setItem('uistate', JSON.stringify({
      openedTask: this.openedTask(),
      goalTask: this.goalTask(),
    }))
  }
  
  setGoalTask(value: number | null) {
    this._setGoalTask(value)
    this.saveState()
  }

  setOpenedTask(value: number | null) {
    this._setOpenedTask(value)
    this.saveState()
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