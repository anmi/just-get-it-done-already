import { JSXElement } from "solid-js"
import styles from './VStack.module.css'

interface VStackProps {
  children: JSXElement
  gap?: number
}

export const VStack = (props: VStackProps) => {
  return <div class={styles.container} style={{ gap: `${props.gap || 8}px` }}>{props.children}</div>  
}