import { JSXElement } from "solid-js"
import styles from './Text.module.css'
import { classes } from "../utils/classes"

interface TextProps {
  children: JSXElement | string
  variant?: 'dim'
}

export const Text = (props: TextProps) => {
  return <span class={
    classes(styles.text, props.variant == 'dim' && styles.dim)
    }>{props.children}</span>
}