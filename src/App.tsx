import { Show, createSignal, type Component } from 'solid-js';

import styles from './App.module.css';
import { CreateTask } from './components/CreateTask';
import { StoreContext } from './storage/StoreContext';
import { InMemoryStore } from './storage/InMemoryStore';
import { TaskList } from './components/TaskList';
import { UIState, UIStateContext } from './storage/UIState';
import { TaskFull } from './components/TaskFull';

const App: Component = () => {
  const store = new InMemoryStore(1)
  const uistate = new UIState()
  return (
    <div class={styles.App}>
      <StoreContext.Provider value={store}>
        <UIStateContext.Provider value={uistate}>
          <Show when={uistate.openedTask() != null}>
            <TaskFull id={uistate.openedTask()!} />
          </Show>
          <CreateTask parentId={store.getRootId()} />
          <TaskList parentId={store.getRootId()} />
        </UIStateContext.Provider>
      </StoreContext.Provider>
    </div>
  );
};

export default App;
