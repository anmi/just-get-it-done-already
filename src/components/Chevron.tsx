import styles from './Chevron.module.css'

interface ChevronProps {
  value: boolean
  onChange: (value: boolean) => void
}

export const Chevron = (props: ChevronProps) => {
  return <input 
    class={styles.checkbox}
    type="checkbox"
    checked={props.value}
    onChange={e => props.onChange(e.currentTarget.checked)}
  />
}