import { For, createMemo, createSignal } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { calcTreePositions, isRedundant } from "../utils/calcTreePositions"
import css from './Board.module.css'
import { TaskBoardItem } from "./TaskBoardItem"
import { Spline } from "./Canvas/Spline"

interface BoardProps {
  id: number
}

export const Board = (props: BoardProps) => {
  const store = useStore()
  
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