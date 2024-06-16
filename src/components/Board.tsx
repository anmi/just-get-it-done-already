import { For, createMemo } from "solid-js"
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
  
  const rels = createMemo(() => store.getTree(props.id)())

  const positions = createMemo(() => {
    return calcTreePositions(props.id, rels().relations)
  })

  return <div class={css.container} style={{
    height: `${positions().maxY}px`,
    width: `${positions().maxX}px`,
    position: 'relative'
  }}>
    Board:
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
      {id => {
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
}