import { createMemo, For } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { useUIState } from "../storage/UIState"
import { Button } from "./Button"
import { Text } from './Text'

interface ParentListProps {
  id: number
}

export const ParentList = (props: ParentListProps) => {
  const store = useStore()
  const uistate = useUIState()
  const parents = createMemo(() => store.getParents(props.id)())

  return (
    <div>
      <Text variant="dim">Parents: </Text>
      <For each={parents()}>
        {id => {
          const task = store.getTask(id)
          return <span>
            <a href="#" onClick={() => {
              uistate.setOpenedTask(id)
            }}
              style={{
                "text-decoration": task().isDone ? 'line-through' : undefined
              }}
            >
              {task().title}
            </a>{' '}
            <Button size="s"
              onClick={() => {
                store.unlink(props.id, task().id)
              }}
            >X</Button>
            {' '}
          </span>
        }}
      </For>
    </div>
  )
}