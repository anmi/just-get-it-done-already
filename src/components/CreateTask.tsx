import { createSignal, } from "solid-js"
import { useStore } from "../storage/StoreContext"
import { Input } from "./Input"
import styles from './CreateTask.module.css'

interface CreateTaskProps {
  parentId: number
}

export const CreateTask = (props: CreateTaskProps) => {
  const [title, setTitle] = createSignal('')
  const store = useStore()
  return <div style={{ position: 'relative' }}>
    <Input 
      class={styles.input}
      onInput={e => {
        setTitle(e.currentTarget!.value)
      }}
      value={title()}
      placeholder="Type task name and press Enter"
      onKeyPress={e => {
        if (e.key === 'Enter') {
          store.createTask(props.parentId, {
            title: title(),
            description: '',
            result: '',
            isPriorityList: false
          })
          setTitle('')
        }
      }}
    />
  </div>
}