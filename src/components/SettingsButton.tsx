import { createSignal, Show } from "solid-js"
import { useUIState } from "../storage/UIState"
import { Button } from "./Button"
import { Checkbox } from "./Checkbox"
import { CheckboxLabel } from "./CheckboxLabel"
import { Portal } from "solid-js/web"
import { Modal } from "./Modal"
import { VStack } from "./VStack"

export const SettingsButton = () => {
  const uistate = useUIState()
  const [show, setShow] = createSignal(false)

  return <>
    <Button onClick={() => {
      setShow(v => !v)
    }}>Settings</Button>
    <Portal>
      <Show when={show()}>
        <Modal>
          <VStack>
            Settings
            <CheckboxLabel>
              <Checkbox value={uistate.showCompleted()} onChange={value => uistate.setShowCompleted(value)} />
              Show completed
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox value={uistate.shift()}
                onChange={shift => uistate.setShift(shift)}
              />
              Shift
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox value={uistate.flipHorizontally()}
                onChange={flip => uistate.setFlipHorizontally(flip)}
              />
              Flip horizontally
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox value={uistate.hideBlockedSubTree()}
                onChange={flip => uistate.setHideBlockedSubtree(flip)}
              />
              Hide postponed subtrees
            </CheckboxLabel>
            <Button onClick={() => setShow(false)}>Close</Button>
          </VStack>
        </Modal>
      </Show>
    </Portal>
  </>
}