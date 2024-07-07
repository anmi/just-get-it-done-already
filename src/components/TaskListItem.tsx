import { createMemo, Show } from "solid-js";
import { useStore } from "../storage/StoreContext";
import { useUIState } from "../storage/UIState";
import styles from './TaskListItem.module.css'
import { MarkdownPreview } from "./MarkdownPreview";

interface TaskListItemProps {
  parentId: number;
  id: number;
}

export const TaskListItem = (props: TaskListItemProps) => {
  const store = useStore()
  const uistate = useUIState()
  const task = createMemo(() =>
    store.getTask(props.id)()
  )

  return <div class={styles.taskListItem}
    onDrop={(e) => {
      const dataTransfer = e.dataTransfer
      if (!dataTransfer) return

      const raw = dataTransfer.getData('application/json')
      const data = JSON.parse(raw)

      if (data.type === 'task') {
        store.link(data.id, props.parentId, props.id)
        e.stopPropagation()
      }
    }}
    onDragOver={e => {
      e.preventDefault()
      return false
    }}
  >
    <input type="checkbox" checked={task().isDone} onChange={(e) => {
      store.setDone(props.id, e.currentTarget.checked)
    }} />
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
    >
      {task().title === '' ? 'Empty' : task().title}
    </a>
    {' '}
    <button onClick={() => {
      store.unlink(props.id, props.parentId)
    }}>X</button>
    <Show when={task().result !== ''}>
      <MarkdownPreview value={task().result} />
    </Show>
  </div>
}