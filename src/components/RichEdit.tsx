import { marked } from 'marked'
import { Show, createEffect, createSignal } from 'solid-js'
import { AutoTextarea } from './AutoTextarea'
import css from './RichEdit.module.css'

interface RichEditProps {
  value: string
  onChange: (value: string) => void
  resetKey?: string
}

export const RichEdit = (props: RichEditProps) => {
  const [isEdit, setIsEdit] = createSignal(false)
  const [draft, setDraft] = createSignal(props.value)
  
  createEffect(() => {
    const value = props.resetKey
    setDraft(props.value)
    setIsEdit(false)
    return value
  })

  return <div>
    <Show when={!isEdit()}>
      <button onClick={() => {
        setIsEdit(true)
      }}>edit</button>
    </Show>
    <Show when={isEdit()}>
      <button onClick={() => {
        setIsEdit(false)
        setDraft(props.value)
      }}>cancel</button>
      <button onClick={() => {
        setIsEdit(false)
        props.onChange(draft())
      }}>save</button>
    </Show>

    <div class={css.content}>
      <div innerHTML={marked(draft())} class={css.preview}>
      </div>
      <Show when={isEdit()}>
        <AutoTextarea
          value={draft()}
          onChange={v => {
            setDraft(v)
          }}
        />
      </Show>
    </div>
  </div>
}