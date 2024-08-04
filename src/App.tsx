import { Show, type Component } from 'solid-js';

import styles from './App.module.css';
import { StoreContext } from './storage/StoreContext';
import { InMemoryStore } from './storage/InMemoryStore';
import { UIState, UIStateContext } from './storage/UIState';
import { TaskFull } from './components/TaskFull';
import { Board } from './components/Board';
import { GlobalControls } from './components/GlobalControls';
import './colors.css';
import { Store } from './storage/store';
import { TaskDraft } from './models/Task';

class JGIDAApi {
  constructor(
    private store: Store,
    private uistate: UIState
  ) {
  }
  
  getCurrent() {
    const taskId = this.uistate.openedTask()
    if (taskId) {
      return this.store.getTask(taskId)()
    }
    return null
  }
  
  setDescription(id: number | null, description: string) {
    if (id) {
      this.store.setDescription(id, description)
    }
  }
  
  setResult(id: number | null, result: string) {
    if (id) {
      this.store.setResult(id, result)
    }
  }
  
  addTask(parentId: number, task: TaskDraft) {
    const baseTask: TaskDraft = {
      title: '',
      description: '',
      result: '',
      isPriorityList: false,
    }
    this.store.createTask(parentId, {
      ...baseTask,
      ...task
    })
  }
}

const App: Component = () => {
  const store = new InMemoryStore(1)
  const uistate = new UIState()
  
  const api = new JGIDAApi(store, uistate)
  ;(window as any).JGIDAAPI= api;
  
  window.addEventListener('message', e => {
    if (e.data.type === 'API') {
      eval(e.data.code)
    }
  })

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
              <Board id={uistate.goalTask() || store.getRootId()} />
            </div>
            <GlobalControls/>
          </div>
        </UIStateContext.Provider>
      </StoreContext.Provider>
    </div>
  );
};

export default App;
