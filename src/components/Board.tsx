import { For, Show, createMemo, createSignal } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { calcTreePositions, isRedundant } from "../utils/calcTreePositions"
import css from './Board.module.css'
import { TaskBoardItem } from "./TaskBoardItem"
import { Spline } from "./Canvas/Spline"
import { useUIState } from "../storage/UIState"
import { Button } from "./Button"
import { HStack } from "./HStack"

interface BoardProps {
  id: number
}

export const Board = (props: BoardProps) => {
  const store = useStore()
  const uistate = useUIState()

  const [showCompleted, setShowCompleted] = createSignal(false)
  // const [flipDepth, setFlipDepth] = createSignal(false)
  const rels = createMemo(() => store.getTree(props.id, showCompleted())())

  const positions = createMemo(() => {
    return calcTreePositions(props.id, rels().relations, {
      shiftDepths: uistate.shift(),
      flipDepth: uistate.flipHorizontally(),
      unlocked: rels().unlocked
    })
  })

  return <div class={css.container}>
    <HStack>
      <Show when={uistate.goalTask() != null && store.getTask(uistate.goalTask()!)()}>
        Goal:
        <a href="#"
          onClick={e => {
            e.preventDefault()
            uistate.setOpenedTask(props.id)
          }}
        >
          {store.getTask(uistate.goalTask()!)().title}
        </a>
        <Button
          size="s"
          onClick={e => {
            e.preventDefault()
            uistate.setGoalTask(null)
          }}
        >Remove</Button>
      </Show>
      <label >
        <input type="checkbox" onChange={e => {
          setShowCompleted(e.currentTarget.checked)
        }} checked={showCompleted()} />
        show completed
      </label>
      <label >
        <input type="checkbox" onChange={e => {
          uistate.setShift(e.currentTarget.checked)
        }} checked={uistate.shift()} />
        shift
      </label>
      <label >
        <input type="checkbox" onChange={e => {
          uistate.setFlipHorizontally(e.currentTarget.checked)
        }} checked={uistate.flipHorizontally()} />
        flip horizontally
      </label>
    </HStack>
    <div style={{
      height: `${positions().maxY}px`,
      width: `${positions().maxX}px`,
      position: 'relative'
    }}>
      {/* Board: */}
      <For each={rels().relations}>
        {rel => {
          return <Spline
            from={positions().positions[rel.taskId]}
            to={positions().positions[rel.dependsOnId]}
            onRemoveClick={() => {

            }}
            removeVisible={false}
            muted={isRedundant(positions().redundantHash, rel)}
          />
        }}
      </For>
      <For each={positions().elementsList}>
        {(id, idx) => {
          const position = positions().positions[id]

          return <TaskBoardItem
            id={id}
            left={positions().positions[id].x}
            top={positions().positions[id].y}
          />
        }
        }
      </For>
    </div>
  </div>
}