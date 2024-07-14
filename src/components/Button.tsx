import { JSX, JSXElement } from "solid-js";
import styles from './Button.module.css';
import { classes } from "../utils/classes";

interface ButtonProps {
  children: JSXElement;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  size?: 'm' | 's'
}

export const Button = (props: ButtonProps) => {
  return <button class={
    classes(
      styles.button,
      props.size === 's' && styles.buttonS
    )
  } onClick={props.onClick}>{props.children}</button>
}