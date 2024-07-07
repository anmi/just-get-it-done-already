import { createMemo } from "solid-js"
import { useStore } from "../storage/StoreContext"
import styles from './TaskFull.module.css'
import { RichEdit } from "./RichEdit"
import { TaskList } from "./TaskList"
import { CreateTask } from "./CreateTask"
import { TitleEditable } from "./TItleEditable"

interface TaskFullProps {
  id: number
}

export const TaskFull = (props: TaskFullProps) => {
  const store = useStore()

  const task = createMemo(() => store.getTask(props.id)())

  return <div class={styles.cont}>
    <div style={{ display: 'flex', "flex-direction": 'row'}}>
      <input type="checkbox" checked={task().isDone} onChange={(e) => {
        store.setDone(props.id, e.currentTarget.checked)
      }} />
      <TitleEditable id={props.id} />
    </div>
    <div>
      <RichEdit value={task().description} onChange={value => {
        store.setDescription(props.id, value)
      }} />
    </div>
    <div
      onDrop={e => {
        const dataTransfer = e.dataTransfer
        if (!dataTransfer) return

        const data = JSON.parse(dataTransfer.getData('application/json'))

        if (data.type === 'task') {
          store.link(data.id, props.id)
        }
      }}
      onDragOver={e => {
        e.preventDefault()
        return false
      }}
    >
      <TaskList parentId={props.id} />
      <CreateTask parentId={props.id} />
    </div>
  </div>
}