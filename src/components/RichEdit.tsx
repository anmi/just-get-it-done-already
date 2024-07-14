import { marked } from 'marked'
import { Show, createEffect, createSignal } from 'solid-js'
import { AutoTextarea } from './AutoTextarea'
import css from './RichEdit.module.css'
import { Button } from './Button'
import { HStack } from './HStack'
import { VStack } from './VStack'

interface RichEditProps {
  value: string
  onChange: (value: string) => void
  resetKey?: string
  editLabel?: string
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
      <Button size="s" onClick={() => {
        setIsEdit(true)
      }}>{props.editLabel ?? 'Edit'}</Button>
    </Show>
    <VStack>
    <Show when={isEdit()}>
      <HStack>
        <Button size="s" onClick={() => {
          setIsEdit(false)
          setDraft(props.value)
        }}>Cancel</Button>
        <Button size="s" onClick={() => {
          setIsEdit(false)
          props.onChange(draft())
        }}>Save</Button>
      </HStack>
    </Show>

    <Show when={isEdit()}>
      <AutoTextarea
        class={css.textarea}
        value={draft()}
        onChange={v => {
          setDraft(v)
        }}
      />
    </Show>
    <div class={css.content}>
      <div innerHTML={marked(draft())} class={css.preview}>
      </div>
    </div>
    </VStack>
  </div>
}