import { createSignal, onCleanup, Show } from "solid-js"
import styles from './PostponeCountdown.module.css'

interface PostponeCountdownProps {
  until: Date
}

function calcLeft(date: Date) {
  return Math.floor((date.valueOf() - new Date().valueOf()) / 1000)
}

function humanizeLeft(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`
  }
  if (seconds < 60 * 60) {
    return `${Math.floor(seconds/60)}m`
  }
  if (seconds < 60 * 60 * 24) {
    return `${Math.floor(seconds/60/60)}h`
  }
}

export const PostponeCountdown = (props: PostponeCountdownProps) => {
  const [seconds, setSeconds] = createSignal(
    calcLeft(props.until)
  )

  const id = setInterval(() => {
    setSeconds(
      calcLeft(props.until)
    )
  }, 1000)

  onCleanup(() => {
    clearInterval(id)
  })

  return <Show when={seconds() > 0}>
    <div class={styles.PostponeCountdown}>{humanizeLeft(seconds())} to unblock</div>
  </Show>
}