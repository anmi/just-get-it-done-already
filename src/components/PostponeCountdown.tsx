import { createSignal, onCleanup, Show } from "solid-js"

interface PostponeCountdownProps {
  until: Date
}

function calcLeft(date: Date) {
  return Math.floor((date.valueOf() - new Date().valueOf()) / 1000)
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
    <div>{seconds()} sec left</div>
  </Show>
}