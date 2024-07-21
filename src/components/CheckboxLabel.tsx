import { JSXElement } from "solid-js"
import styles from './CheckboxLabel.module.css'

interface CheckboxLabelProps {
  children: JSXElement;
}

export const CheckboxLabel = (props: CheckboxLabelProps) => {
  return <label class={styles.label}>
    {props.children}
  </label>
}