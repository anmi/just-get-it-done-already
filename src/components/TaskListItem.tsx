import { useStore } from "../storage/StoreContext";
import { useUIState } from "../storage/UIState";

interface TaskListItemProps {
  parentId: number;
  id: number;
}

export const TaskListItem = (props: TaskListItemProps) => {
  const store = useStore()
  const uistate = useUIState()
  const task = store.getTask(props.id)

  return <div>
    <div>
      <input type="checkbox" checked={task().isDone} onChange={(e) => {
        store.setDone(props.id, e.currentTarget.checked)
      }} />
      <a href="#" onClick={e => {
        e.preventDefault()
        uistate.setOpenedTask(props.id)
      }}>
        {task().title}
      </a>
      <button onClick={() => {
        store.unlink(props.id, props.parentId)
      }}>X</button>
    </div>
  </div>
}