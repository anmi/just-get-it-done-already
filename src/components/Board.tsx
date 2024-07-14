import { For, Show, createMemo, createSignal } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { calcTreePositions, isRedundant } from "../utils/calcTreePositions"
import css from './Board.module.css'
import { TaskBoardItem } from "./TaskBoardItem"
import { Spline } from "./Canvas/Spline"
import { useUIState } from "../storage/UIState"

interface BoardProps {
  id: number
}

export const Board = (props: BoardProps) => {
  const store = useStore()
  const uistate = useUIState()
  
  const [showCompleted, setShowCompleted] = createSignal(false)
  const [shift, setShift] = createSignal(false)
  const [flipDepth, setFlipDepth] = createSignal(false)
  const rels = createMemo(() => store.getTree(props.id, showCompleted())())

  const positions = createMemo(() => {
    return calcTreePositions(props.id, rels().relations, {
      shiftDepths: shift(),
      flipDepth: flipDepth(),
      unlocked: rels().unlocked
    })
  })

  return <div class={css.container}>
    <label >
      <input type="checkbox" onChange={e => {
        setShowCompleted(e.currentTarget.checked)
      }} checked={showCompleted()}/>
        show completed
    </label>
    <label >
      <input type="checkbox" onChange={e => {
        setShift(e.currentTarget.checked)
      }} checked={shift()}/>
        shift
    </label>
    <label >
      <input type="checkbox" onChange={e => {
        setFlipDepth(e.currentTarget.checked)
      }} checked={flipDepth()}/>
        flip horizontally
    </label>
    <Show when={uistate.goalTask() != null && store.getTask(uistate.goalTask()!)()}>
      {' '}Goal:{' '}
      <a href="#"
        onClick={e => {
          e.preventDefault()
          uistate.setOpenedTask(props.id)
        }}
      >
        {store.getTask(uistate.goalTask()!)().title}
      </a>
      {' '}
      <button
        onClick={e => {
          e.preventDefault()
          uistate.setGoalTask(null)
        }}
      >Remove</button>
    </Show>
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