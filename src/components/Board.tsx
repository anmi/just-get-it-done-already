import { For, createMemo, createSignal } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { calcTreePositions } from "../utils/calcTreePositions"
import css from './Board.module.css'
import { TaskBoardItem } from "./TaskBoardItem"
import { Spline } from "./Canvas/Spline"

interface BoardProps {
  id: number
}

export const Board = (props: BoardProps) => {
  const store = useStore()
  
  const [showCompleted, setShowCompleted] = createSignal(false)
  const rels = createMemo(() => store.getTree(props.id, showCompleted())())

  const positions = createMemo(() => {
    return calcTreePositions(props.id, rels().relations)
  })

  return <div class={css.container}>
    <label >
      <input type="checkbox" onChange={e => {
        setShowCompleted(e.currentTarget.checked)
      }} checked={showCompleted()}/>
        show completed
    </label>
  <div style={{
    height: `${positions().maxY}px`,
    width: `${positions().maxX}px`,
    position: 'relative'
  }}>
    {/* Board: */}
    <For each={rels().relations}>
      {rel => {
        const parent = positions().positions[rel.taskId]
        const child = positions().positions[rel.dependsOnId]
        return <Spline
          from={parent}
          to={child}
          onRemoveClick={() => {
            
          }}
          removeVisible={false}
          muted={false}
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