import { createMemo, Show } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { useUIState } from "../storage/UIState"
import styles from './TaskBoardItem.module.css'
import { PostponeCountdown } from "./PostponeCountdown"

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
    top: `${props.top}px`,
    transition: "left 300ms, top 300ms",
    "max-width": '172px'
  }}
  >
    <a href="#"
      onClick={e => {
        e.preventDefault()
        uistate.setOpenedTask(props.id)
      }}
      onDragStart={e => {
        const dataTransfer = e.dataTransfer
        if (dataTransfer) {
          dataTransfer.effectAllowed = "move"
          dataTransfer.setData('application/json', JSON.stringify({
            type: 'task',
            id: props.id
          }))
        }
      }}
      style={{
        "text-decoration": task().isDone ? 'line-through' : '',
      }}
      class={task().id === uistate.openedTask() ? styles.selected : undefined}
    >
      {task().title}
    </a>
    <Show when={task().postponedUntil}>
      <PostponeCountdown until={task().postponedUntil!} />
    </Show>
  </div>
}