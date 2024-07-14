import { createEffect, createSignal } from "solid-js"
import { classes } from "../utils/classes";
import styles from './AutoTextarea.module.css'

interface AutoTextareaPrpos {
  value: string
  onChange: (value: string) => void
  class?: string
}

const GAP = 0;

export const AutoTextarea = (props: AutoTextareaPrpos) => {
  const [height, setHeight] = createSignal<number | null>(null)
  
  const comp = <textarea
    class={classes(props.class, styles.AutoTextarea)}
      value={props.value}
      onInput={e => {
        props.onChange(e.currentTarget.value)
        setHeight(e.currentTarget.scrollHeight)
      }}
      style={{
        padding: `${GAP}px`,
        height: height() ?
          `${height()! - GAP * 2}px` : '',
        // width: '400px',
        "flex-grow": "2"
      }}
    />  
  
  createEffect(() => {
      setHeight((comp as any).scrollHeight)
  })

  return <>
    {comp}
  </>
}