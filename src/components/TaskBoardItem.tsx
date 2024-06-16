import { Show, createEffect, createMemo } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { useUIState } from "../storage/UIState"

interface TaskBoardItemProps {
  id: number
  top: number
  left: number
}

export const TaskBoardItem = (props: TaskBoardItemProps) => {
  const store = useStore()
  const uistate = useUIState()
  const task = createMemo(() => store.getTask(props.id)())
  
  return <div style={{
    position: 'absolute',
    left: `${props.left}px`,
    top: `${props.top}px`
  }}
  >
    <a href="#" onClick={e => {
      e.preventDefault()
      uistate.setOpenedTask(props.id)
    }}
      style={{
        "text-decoration": task().isDone ? 'line-through' : ''
      }}
    >
    {task().title}
    </a>
  </div>
}