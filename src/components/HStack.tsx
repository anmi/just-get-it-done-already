import { JSXElement } from "solid-js"
import styles from './HStack.module.css'

interface HStackProps {
  children: JSXElement
  gap?: number
  justifyContent?: "end"
}

export const HStack = (props: HStackProps) => {
  return <div class={styles.container} style={{
    gap: `${props.gap || 8}px`,
    "justify-content": props.justifyContent ? 'flex-end' : undefined
  }}>{props.children}</div>
}