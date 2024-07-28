import { Accessor, Setter, createContext, createSignal, useContext } from "solid-js"

export class UIState {
  openedTask: Accessor<number | null>
  _setOpenedTask: Setter<number | null>
  goalTask: Accessor<number | null>
  _setGoalTask: Setter<number | null>
  shift: Accessor<boolean>
  _setShift: Setter<boolean>
  flipHorizontally: Accessor<boolean>
  _setFlipHorizontally: Setter<boolean>
  hideBlockedSubTree: Accessor<boolean>
  _setHideBlockedSubTree: Setter<boolean>
  
  constructor() {
    const [openedTask, setOpenedTask] = createSignal<number | null>(null)
    this.openedTask = openedTask
    this._setOpenedTask = setOpenedTask
    const [goalTask, setGoalTask] = createSignal<number | null>(null)
    this._setGoalTask = setGoalTask
    this.goalTask = goalTask
    const [shift, setShift] = createSignal<boolean>(false)
    this.shift = shift
    this._setShift = setShift
    const [flipHorizontally, setFlipHorizontally] = createSignal<boolean>(false)
    this.flipHorizontally = flipHorizontally
    this._setFlipHorizontally = setFlipHorizontally
    const [hideBlockedSubTree, setHideBlockedSubTree] = createSignal<boolean>(false)
    this.hideBlockedSubTree = hideBlockedSubTree
    this._setHideBlockedSubTree = setHideBlockedSubTree
    
    const rawStored = localStorage.getItem('uistate')
    
    if (rawStored) {
      const data = JSON.parse(rawStored)
      
      this._setOpenedTask(data.openedTask)
      this._setGoalTask(data.goalTask)
      this._setShift(data.shift)
      this._setFlipHorizontally(data.flipHorizontally)
      this._setHideBlockedSubTree(data.hideBlockedSubTree)
    }
  }
  
  saveState() {
    localStorage.setItem('uistate', JSON.stringify({
      openedTask: this.openedTask(),
      goalTask: this.goalTask(),
      shift: this.shift(),
      flipHorizontally: this.flipHorizontally(),
      hideBlockedSubTree: this.hideBlockedSubTree(),
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
  
  setShift(value: boolean) {
    this._setShift(value)
    this.saveState()
  }
  
  setFlipHorizontally(value: boolean) {
    this._setFlipHorizontally(value)
    this.saveState()
  }
  
  setHideBlockedSubtree(value: boolean) {
    this._setHideBlockedSubTree(value)
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