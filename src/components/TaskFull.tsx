import { createEffect, createMemo, onCleanup, Show } from "solid-js"
import { useStore } from "../storage/StoreContext"
import styles from './TaskFull.module.css'
import { RichEdit } from "./RichEdit"
import { TaskList } from "./TaskList"
import { CreateTask } from "./CreateTask"
import { TitleEditable } from "./TItleEditable"
import { useUIState } from "../storage/UIState"
import { HStack } from "./HStack"
import { Button } from "./Button"
import { VStack } from "./VStack"
import { PostponeCountdown } from "./PostponeCountdown"
import { Checkbox } from "./Checkbox"
import { CheckboxLabel } from "./CheckboxLabel"
import { Collapse } from "./Collapse"

interface TaskFullProps {
  id: number
}

export const TaskFull = (props: TaskFullProps) => {
  const store = useStore()
  const uiState = useUIState()

  const task = createMemo(() => store.getTask(props.id)())

  const handleGlobalClick = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      uiState.setOpenedTask(null)
    }
  }

  document.addEventListener('keydown', handleGlobalClick)
  onCleanup(() => {
    document.removeEventListener('keydown', handleGlobalClick)
  })

  return <div class={styles.cont}>
    <VStack gap={16}>
      <HStack>
        <Checkbox
          value={task().isDone}
          onChange={isDone => store.setDone(props.id, isDone)}
        />
        <TitleEditable id={props.id} />
        <Button onClick={e => {
          uiState.setOpenedTask(null)
        }}>close</Button>
      </HStack>
      <RichEdit
        editLabel="Edit description"
        value={task().description} onChange={value => {
          store.setDescription(props.id, value)
        }}
      />
      <TaskList parentId={props.id} />
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
        <CreateTask parentId={props.id} />
      </div>
      <div>
        <RichEdit
          value={task().result}
          onChange={value => {
            store.setResult(props.id, value)
          }}
          editLabel="Add/Edit result"
        />
      </div>
      <div style={{ height: '16px' }}></div>
      <Collapse title="More options">
        <CheckboxLabel>
          <Checkbox
            value={task().isPriorityList}
            onChange={isPriority => store.setIsPriorityList(props.id, isPriority)}
          />
          Priority list
        </CheckboxLabel>
        <HStack>
          <div>Postpone</div>
          <Button size="s" onClick={() => {
            store.postpone(props.id, new Date(new Date().valueOf() + 1000 * 60 * 5))
          }}>5m</Button>
          <Button size="s" onClick={() => {
            store.postpone(props.id, new Date(new Date().valueOf() + 1000 * 60 * 10))
          }}>10m</Button>
          <Button size="s" onClick={() => {
            store.postpone(props.id, new Date(new Date().valueOf() + 1000 * 60 * 30))
          }}>30m</Button>
          <Button size="s" onClick={() => {
            store.postpone(props.id, new Date(new Date().valueOf() + 1000 * 60 * 60))
          }}>1h</Button>
          <Button size="s" onClick={() => {
            store.postpone(props.id, new Date(new Date().valueOf() + 1000 * 60 * 60 * 2))
          }}>2h</Button>
          <Button size="s" onClick={() => {
            store.postpone(props.id, new Date(new Date().valueOf() + 1000 * 60 * 60 * 4))
          }}>4h</Button>
          <Button size="s" onClick={() => {
            store.postpone(props.id, new Date(new Date().valueOf() + 1000 * 60 * 60 * 24))
          }}>day</Button>
          <Show when={task().postponedUntil}>
            <Button size="s" onClick={() => {
              store.postpone(props.id, null)
            }}>reset</Button>
            <PostponeCountdown until={task().postponedUntil!} />
          </Show>
        </HStack>
        <div>
          <Button
            size="s"
            onClick={() => {
              uiState.setGoalTask(props.id)
            }}
          >Set as goal</Button>
        </div>
      </Collapse>
    </VStack>
  </div>
}