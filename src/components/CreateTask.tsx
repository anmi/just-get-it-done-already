import { createSignal, } from "solid-js"
import { useStore } from "../storage/StoreContext"

interface CreateTaskProps {
  parentId: number
}

export const CreateTask = (props: CreateTaskProps) => {
  const [title, setTitle] = createSignal('')
  const store = useStore()
  return <div>
    Add: <input onInput={e => {
      setTitle(e.currentTarget.value)
    }} value={title()}
      onkeypress={e => {
        if (e.key === 'Enter') {
          store.createTask(props.parentId, {
            title: title(),
            description: '',
            result: ''
          })
          setTitle('')
        }
      }}
    />
  </div>
}