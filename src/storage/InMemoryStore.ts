import { Accessor, Setter, createSignal, onCleanup } from "solid-js";
import { Task, TaskDraft, taskMethods } from "../models/Task";
import { Store } from "./store";

const EMPTY_ARRAY: number[] = []

interface Relation {
  taskId: number;
  dependsOnId: number;
}

function mapHash<K extends string | number, T1, T2>(
  o: Record<K, T1>,
  fn: (v: T1) => T2
): Record<K, T2> {
  return Object.fromEntries(
    Object.entries(o)
      .map(([key, v]) => [key, fn(v as any)])
  ) as any
}

const hasChild = (id: number, maybeChild: number, childrenHash: { [key: number]: number[] }) => {
  const queue = [id]
  const visited: { [key: string]: true } = {}

  while (queue.length > 0) {
    const head = queue.unshift();
    if (visited[head]) {
      continue
    }
    visited[head] = true

    if (head === maybeChild) return true;

    const children = childrenHash[head]

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      queue.push(child)
    }
  }

  return false
}

export class InMemoryStore implements Store {
  rootId: number
  tasks: {
    [key: number]: Task
  } = {}
  tasksSignals: {
    [key: number]: { get: Accessor<Task>, set: Setter<Task> }
  } = {}
  children: {
    [key: number]: number[]
  } = {}
  incId: number
  onChange: (() => void)[] = []

  constructor(rootId: number) {
    this.rootId = rootId
    this.incId = rootId

    const rawStored = localStorage.getItem('tasks')

    if (rawStored) {
      const data = JSON.parse(rawStored)

      this.tasks = mapHash(data.tasks, taskMethods.deserialize)
      this.tasksSignals = mapHash(this.tasks, task => {
        const [get, set] = createSignal(task)
        return {get, set}
      })
      this.children = data.children
      this.rootId = data.rootId
      this.incId = data.incId
    }
  }
  
  save() {
    localStorage.setItem('tasks',
      JSON.stringify({
        tasks: mapHash(this.tasks, taskMethods.serialize),
        children: this.children,
        rootId: this.rootId,
        incId: this.incId,
      })
    )
  }

  trigger() {
    this.save()
    for (let i = 0; i < this.onChange.length; i++) {
      const fn = this.onChange[i]
      fn()
    }
  }

  genId() {
    this.incId++
    return this.incId
  }

  generateRootId() {
    this.rootId = 1;
  }

  onUpdate(fn: () => void) {
    this.onChange.push(fn)
    onCleanup(() => {
      this.onChange = this.onChange.filter(f => f != fn)
    })
  }

  getRootId() {
    return this.rootId
  }
  
  setTask(task: Task) {
    this.tasks[task.id] = task
    if (!this.tasksSignals[task.id]) {
      const [get, set] = createSignal<Task>(task)
      this.tasksSignals[task.id] = {get, set}
    }
    
    this.tasksSignals[task.id].set(task)
    
    this.trigger()
  }

  createTask(parentId: number, draft: TaskDraft) {
    const task: Task = {
      id: this.genId(),
      isDone: false,
      postponedUntil: null,
      ...draft
    }

    this.children[parentId] = [...(this.children[parentId] || EMPTY_ARRAY), task.id]

    this.setTask(task)

    this.trigger()
  }

  getChildren(parentId: number) {
    const children = this.children[parentId] || EMPTY_ARRAY
    const [ids, setIds] = createSignal<number[]>(children)
    this.onUpdate(() => {
      setIds(this.children[parentId] || EMPTY_ARRAY)
    })

    return ids
  }

  getTask(id: number) {
    if (id === this.getRootId()) {
      const [f] = createSignal<Task>({
        id,
        title: 'Root',
        description: '',
        result: '',
        isDone: false,
        postponedUntil: null,
        isPriorityList: false,
      })

      return f
    }
    
    return this.tasksSignals[id].get
  }

  unlink(id: number, parentId: number): void {
    const children = this.children[parentId]
    if (children) {
      this.children[parentId] = children.filter(c => c != id)
    }

    this.trigger()
  }

  link(id: number, parentId: number): void {
    if (id == parentId) {
      return;
    }
    const children = this.children[parentId]
    if (children.findIndex(p => p === id) != -1) {
      return;
    }

    if (hasChild(id, parentId, this.children)) {
      return
    }

    this.children[parentId] = [...children, id]
    this.trigger()
  }

  setDone(id: number, isDone: boolean) {
    const task = this.tasks[id]
    
    this.setTask({...task, isDone})
  }

  setDescription(id: number, description: string): void {
    const task = this.tasks[id]

    if (task) {
      this.tasks[id] = {
        ...task,
        description
      }
      this.trigger()
    }
  }

  getTree(rootId: number, showCompleted: boolean): Accessor<{ relations: Relation[]; }> {
    const [rels, setRels] = createSignal<{ relations: Relation[] }>({ relations: [] })

    const upd = () => {
      const queue = [rootId]
      const visited: { [key: number]: boolean } = {}
      const result: Relation[] = []

      while (queue.length > 0) {
        const current = queue.shift()
        if (!current || visited[current]) {
          continue
        }
        const children = this.children[current]
        if (children) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i]

            const task = this.tasks[child]
            if (task) {
              if (!showCompleted && task.isDone) {
                continue
              }
            }
            result.push({
              taskId: current,
              dependsOnId: child
            })
            queue.unshift(child)
          }
        }
      }
      setRels({ relations: result })
    }

    upd()
    this.onUpdate(upd)


    return rels
  }
}
