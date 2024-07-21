import styles from './Checkbox.module.css'

interface CheckboxProps {
  value: boolean
  onChange: (value: boolean) => void
}

export const Checkbox = (props: CheckboxProps) => {
  return <input 
    class={styles.checkbox}
    type="checkbox"
    checked={props.value}
    onChange={e => props.onChange(e.currentTarget.checked)}
  />
}