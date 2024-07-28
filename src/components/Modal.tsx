import { JSXElement } from "solid-js"
import styles from './Modal.module.css'

interface ModalProps {
  children: JSXElement
}

export const Modal = (props: ModalProps) => {
  return <div class={styles.modal}>
    {props.children}
  </div>
}