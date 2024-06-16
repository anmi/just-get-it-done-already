import { createSignal, onCleanup } from "solid-js";
import { Task, TaskDraft, taskMethods } from "../models/Task";
import { Store } from "./store";

const EMPTY_ARRAY: number[] = []

function mapHash<K extends string | number, T1, T2>(
  o: Record<K, T1>,
  fn: (v: T1) => T2
): Record<K, T2> {
  return Object.fromEntries(
    Object.entries(o)
      .map(([key, v]) => [key, fn(v as any)])
  ) as any
}

export class InMemoryStore implements Store {
  rootId: number
  tasks: {
    [key: number]: Task
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
      this.children = data.children
      this.rootId = data.rootId
      this.incId = data.incId
    }
  }

  trigger() {
    localStorage.setItem('tasks',
      JSON.stringify({
        tasks: mapHash(this.tasks, taskMethods.serialize),
        children: this.children,
        rootId: this.rootId,
        incId: this.incId,
      })
    )
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

  createTask(parentId: number, draft: TaskDraft) {
    const task: Task = {
      id: this.genId(),
      isDone: false,
      postponedUntil: null,
      ...draft
    }

    this.children[parentId] = [...(this.children[parentId] || EMPTY_ARRAY), task.id]

    this.tasks[task.id] = task

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
    const [task, setTask] = createSignal<Task>(this.tasks[id])
    this.onUpdate(() => {
      setTask(this.tasks[id])
    })

    return task
  }
  
  unlink(id: number, parentId: number): void {
    const children = this.children[parentId]
    if (children) {
      this.children[parentId] = children.filter(c => c != id)
    }
    
    this.trigger()
  }
  
  setDone(id: number, isDone: boolean) {
    const task = this.tasks[id]
    
    if (task) {
      this.tasks[id] = {
        ...task,
        isDone
      }
      this.trigger()
    }
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
}
