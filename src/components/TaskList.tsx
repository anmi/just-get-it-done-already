import { For, createEffect, createMemo, createSignal } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { TaskListItem } from "./TaskListItem"

interface TaskListProps {
  parentId: number
}

export const TaskList = (props: TaskListProps) => {
  const store = useStore()
  const ids = createMemo(() => store.getChildren(props.parentId)())

  return <div>
    <For each={ids()}>
      {v => <div>{<TaskListItem id={v} parentId={props.parentId}/>}</div>}
    </For>
  </div>
}