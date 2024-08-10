import { createMemo, For, Show } from "solid-js";
import { useStore } from "../storage/StoreContext";
import { useUIState } from "../storage/UIState";
import styles from './TaskListItem.module.css'
import { MarkdownPreview } from "./MarkdownPreview";
import { Button } from "./Button";
import { HStack } from "./HStack";
import { Checkbox } from "./Checkbox";
import { Text } from "./Text";
import { VStack } from "./VStack";

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
  
  const alternativePath = createMemo(() =>  {
    return store.getAletrnativePath(props.id, props.parentId)()
  })
  
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
  <VStack>
    <HStack>
      <Checkbox
        value={task().isDone}
        onChange={(value) => store.setDone(props.id, value)}
      />
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
      <Button size="s" onClick={() => {
        store.unlink(props.id, props.parentId)
      }}>X</Button>
    </HStack>
    <Show when={alternativePath().length > 0}>
      <HStack>
        <Text variant="dim" size="s">
          Dependency is duplicated through
        </Text>
        <For each={alternativePath()}>{task => 
          <Text size="s">
            <a href="#" onClick={e => {
              e.preventDefault()
              uistate.setOpenedTask(task.id)
            }}>
              {task.title}
            </a>
          </Text>
        }</For>
      </HStack>
    </Show>
    <Show when={task().result !== ''}>
      <MarkdownPreview value={task().result} />
    </Show>
  </VStack>
  </div>
}