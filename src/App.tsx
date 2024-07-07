import { Show, type Component } from 'solid-js';

import styles from './App.module.css';
import { StoreContext } from './storage/StoreContext';
import { InMemoryStore } from './storage/InMemoryStore';
import { UIState, UIStateContext } from './storage/UIState';
import { TaskFull } from './components/TaskFull';
import { Board } from './components/Board';

const App: Component = () => {
  const store = new InMemoryStore(1)
  const uistate = new UIState()
  return (
    <div class={styles.App}>
      <StoreContext.Provider value={store}>
        <UIStateContext.Provider value={uistate}>
          <div class={styles.layout}>
            <Show when={uistate.openedTask() != null}>
              <div class={styles.layoutTask}>
                <TaskFull id={uistate.openedTask()!} />
              </div>
            </Show>
            <div class={styles.layoutBoard}>
              <Board id={store.getRootId()} />
            </div>
          </div>
        </UIStateContext.Provider>
      </StoreContext.Provider>
    </div>
  );
};

export default App;
