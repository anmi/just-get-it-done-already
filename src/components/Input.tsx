import { classes } from '../utils/classes';
import styles from './Input.module.css'
import { JSX } from 'solid-js/jsx-runtime';

interface InputProps {
  class?: string;
  value: string;
  onKeyPress: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>
  onInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent>
  placeholder?: string
}

export const Input = (props: InputProps) => {
  return <input
    class={classes(styles.Input, props.class)}
    placeholder={props.placeholder}
    onKeyPress={props.onKeyPress}
    onInput={props.onInput}
    value={props.value}
  />
}