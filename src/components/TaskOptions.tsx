import { createMemo, Show } from "solid-js";
import { useStore } from "../storage/StoreContext"
import { Button } from "./Button"
import { Checkbox } from "./Checkbox"
import { CheckboxLabel } from "./CheckboxLabel"
import { HStack } from "./HStack";
import { PostponeCountdown } from "./PostponeCountdown";
import { useUIState } from "../storage/UIState";

interface TaskOptionsProps {
  id: number;
}

export const TaskOptions = (props: TaskOptionsProps) => {
  const uiState = useUIState()
  const store = useStore()

  const task = createMemo(() => store.getTask(props.id)())

  return <>
    <CheckboxLabel>
      <Checkbox
        value={task().isPriorityList}
        onChange={isPriority => store.setIsPriorityList(props.id, isPriority)}
      />
      Priority list
    </CheckboxLabel>
    <CheckboxLabel>
      <Checkbox
        value={task().isAutodone}
        onChange={isPriority => store.setIsAutodone(props.id, isPriority)}
      />
      Complete automatically when subtasks are completed
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
  </>
}