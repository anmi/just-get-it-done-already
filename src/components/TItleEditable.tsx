import { createEffect, createMemo, createSignal, Show } from "solid-js"
import { useStore } from "../storage/StoreContext"
import styles from './TitleEditable.module.css'

interface TitleEditableProps {
  id: number
}

export const TitleEditable = (props: TitleEditableProps) => {
  const store = useStore()
  const originalTitle = createMemo(() => store.getTask(props.id)().title)
  const [title, setTitle] = createSignal(originalTitle())
  const [hasChanges, setHasChanges] = createSignal(false)

  // Reset title on id change
  createEffect(() => {
    if (props.id) {
      setHasChanges(false)
      setTitle(originalTitle())
    }
  })

  return <span class={styles.container}>
    <input
      class={styles.input}
      value={title()}
      onInput={e => {
        setHasChanges(true)
        setTitle(e.currentTarget.value)
      }}
      onKeyPress={e => {
        if (e.code === 'Enter') {
          setHasChanges(false)
          store.setTitle(props.id, title())
        }
      }}
    />
    <Show when={hasChanges()}>
      <button onClick={(e) => {
        setHasChanges(false)
        store.setTitle(props.id, title())
      }}>Save</button>
    </Show>
  </span>
}
