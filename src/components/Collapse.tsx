import { createSignal, JSXElement, Show } from "solid-js"
import { VStack } from "./VStack";
import { Chevron } from "./Chevron";
import { HStack } from "./HStack";
import { CheckboxLabel } from "./CheckboxLabel";
import { Text } from './Text'

interface CollapseProps {
  title: string;
  children: JSXElement;
}

export const Collapse = (props: CollapseProps) => {
  const [opened, setOpened] = createSignal(false)
  return <div>
    <VStack gap={16}>
      <CheckboxLabel>
        <Chevron value={opened()} onChange={v => setOpened(v)}/>
        <Text variant="dim">{props.title}</Text>
      </CheckboxLabel>
    <Show when={opened()}>
      {props.children}
    </Show>
    </VStack>
  </div>
}
