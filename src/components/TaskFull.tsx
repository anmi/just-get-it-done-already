import { createMemo } from "solid-js"
import { useStore } from "../storage/StoreContext"
import styles from './TaskFull.module.css'
import { RichEdit } from "./RichEdit"
import { TaskList } from "./TaskList"
import { CreateTask } from "./CreateTask"

interface TaskFullProps {
  id: number
}

export const TaskFull = (props: TaskFullProps) => {
  const store = useStore()

  const task = createMemo(() => store.getTask(props.id)())

  return <div class={styles.cont}>
    <input type="checkbox" checked={task().isDone} onChange={(e) => {
      store.setDone(props.id, e.currentTarget.checked)
    }} />
    {task().title}
    <div>
      <RichEdit value={task().description} onChange={value => {
        store.setDescription(props.id, value)
      }} />
    </div>
    <CreateTask parentId={props.id} />
    <TaskList parentId={props.id} />
  </div>
}