import { useStore } from "../storage/StoreContext";
import { useUIState } from "../storage/UIState";
import styles from './TaskListItem.module.css'

interface TaskListItemProps {
  parentId: number;
  id: number;
}

export const TaskListItem = (props: TaskListItemProps) => {
  const store = useStore()
  const uistate = useUIState()
  const task = store.getTask(props.id)

  return <div class={styles.taskListItem}>
    <input type="checkbox" checked={task().isDone} onChange={(e) => {
      store.setDone(props.id, e.currentTarget.checked)
    }} />
    <a href="#" onClick={e => {
      e.preventDefault()
      uistate.setOpenedTask(props.id)
    }}>
      {task().title}
    </a>
    {' '}
    <button onClick={() => {
      store.unlink(props.id, props.parentId)
    }}>X</button>
  </div>
}