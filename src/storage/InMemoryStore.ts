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
    const head = queue.shift();
    if (!head) continue
    if (visited[head]) {
      continue
    }
    visited[head] = true

    if (head === maybeChild) return true;

    const children = childrenHash[head]

    if (!children) continue

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      queue.push(child)
    }
  }

  return false
}

function isEveryLeafDelayed(store: InMemoryStore, taskId: number): Date | null {
  const task = store.tasks[taskId]
  const children = store.children[taskId] || []

  let unfinishedChildren: number[] = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const subtask = store.tasks[child]
    if (!subtask.isDone) {
      unfinishedChildren.push(child)
    }
  }
  
  if (unfinishedChildren.length == 0) {
    if (!task.postponedUntil) {
      return null
    } else {
      if (task.postponedUntil > new Date) {
        return task.postponedUntil
      }
    }
  }
  
  let delayed = true;
  let postponedUntil: null | Date = null
  for (let i = 0; i < unfinishedChildren.length; i++) {
    const child = unfinishedChildren[i]
    
    const postponedUntilTask = isEveryLeafDelayed(store, child)
    if (!postponedUntilTask) {
      delayed = false
    } else {
      postponedUntil = nullableMinDate(postponedUntil, postponedUntilTask)
    }
  }

  return delayed ? postponedUntil : null
}

function isSubTreeDelayed(store: InMemoryStore, taskId: number) {
  const task = store.tasks[taskId]
  const children = store.children[taskId] || []

  let unfinishedChildren: number[] = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const subtask = store.tasks[child]
    if (subtask.isDone == false) {
      unfinishedChildren.push(child)
    }
  }
  
  if (unfinishedChildren.length == 0) {
    if (!task.postponedUntil) {
      return false
    } else {
      return task.postponedUntil > new Date
    }
  }
  
  for (let i = 0; i < unfinishedChildren.length; i++) {
    const child = unfinishedChildren[i]
    
    if (!isSubTreeDelayed(store, child)) {
      return false
    }
  }
  
  return true
}

function nullableMinDate(a: Date | null, b: Date | null) {
  if (a == null) {
    return b
  }
  if (b == null) {
    return a
  }
  
  return new Date(Math.min(a.valueOf(), b.valueOf()))
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
  parents: {
    [key: number]: number[]
  } = {}
  incId: number
  onChange: (() => void)[] = []

  constructor(rootId: number) {
    this.rootId = rootId
    this.incId = rootId

    const rawStored = localStorage.getItem('tasks')

    if (rawStored) {
      this.updateFromJSON(rawStored)
    }
  }

  updateFromJSON(rawStored: string): void {
    const data = JSON.parse(rawStored)

    this.tasks = mapHash(data.tasks, taskMethods.deserialize)
    this.tasksSignals = mapHash(this.tasks, task => {
      const [get, set] = createSignal(task)
      return { get, set }
    })
    this.children = data.children
    this.rootId = data.rootId
    this.incId = data.incId
    
    const ids = Object.keys(this.children).map(id => parseInt(id, 10))
    
    for (let i = 0; i < ids.length; i++) {
      const parentId = ids[i]
      const children = this.children[parentId]
      
      for (let j = 0; j < children.length; j++) {
        const child = children[j]

        this.parents[child] ??= []
        if (!this.parents[child].includes(parentId)) {
          this.parents[child].push(parentId)
        }
      }
    }
    
    this.cleanDeleted()
    
    this.trigger()
  }
  
  cleanDeleted() {
    const tasks = Object.values(this.tasks)
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
    
      if (this.rootId === task.id) {
        continue
      }
    
      if (!this.parents[task.id] ||
        this.parents[task.id].length === 0
      ) {
        delete this.tasks[task.id]
        delete this.children[task.id]
      }
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
    const slice = this.onChange.slice(0)
    for (let i = 0; i < slice.length; i++) {
      const fn = slice[i]

      if (this.onChange.find(f => f === fn)) {

        fn()
      }
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
      this.tasksSignals[task.id] = { get, set }
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

    this.setTask(task)

    this.link(task.id, parentId)
    
    this.recalculateAutodone(task.id)

    this.trigger()
    
    return task
  }

  getChildren(parentId: number) {
    const children = this.children[parentId] || EMPTY_ARRAY
    const [ids, setIds] = createSignal<number[]>(children)
    this.onUpdate(() => {
      setIds(this.children[parentId] || EMPTY_ARRAY)
    })

    return ids
  }
  
  getParents(id: number) {
    const parents = this.parents[id] || EMPTY_ARRAY
    const [ids, setIds] = createSignal<number[]>(parents)
    this.onUpdate(() => {
      setIds(this.parents[id] || EMPTY_ARRAY)
    })
    
    return ids
  }

  getTask(id: number) {
    if (id === this.getRootId()) {
      if (this.tasksSignals[id]) {
        return this.tasksSignals[id].get
      }

      const task: Task = {
        id,
        title: 'Root',
        description: '',
        result: '',
        isDone: false,
        postponedUntil: null,
        isPriorityList: false,
        isAutodone: false,
      }
      this.setTask(task)
      const [f] = createSignal<Task>(task)

      return f
    }
    
    return this.tasksSignals[id].get
  }

  unlink(id: number, parentId: number): void {
    const children = this.children[parentId]
    if (children) {
      this.children[parentId] = children.filter(c => c != id)
    }
    this.parents[id] ??= []
    this.parents[id] = this.parents[id].filter(c => c !== parentId)

    this.trigger()
  }
  
  rearrange(id: number, parentId: number, positionId: number) {
    const children = this.children[parentId]
    
    const targetPos = children.findIndex(f => f === positionId)
    const currentPos = children.findIndex(f => f === id) 

    if (targetPos < currentPos) {
      this.children[parentId] = [
        ...children.slice(0, targetPos),
        id,
        positionId,
        ...children.slice(targetPos + 1, currentPos),
        ...children.slice(currentPos + 1)
      ]
    } else {
      this.children[parentId] = [
        ...children.slice(0, currentPos),
        ...children.slice(currentPos + 1, targetPos),
        positionId,
        id,
        ...children.slice(targetPos + 1)
      ]
    }
    
    this.trigger()
  }

  link(id: number, parentId: number, positionId?: number): void {
    if (id == parentId) {
      return;
    }
    if (id === positionId) {
      return;
    }
    const children = this.children[parentId] || []
    if (children.findIndex(p => p === id) != -1) {
      if (positionId) {
        this.rearrange(id, parentId, positionId)
      }
      return;
    }

    if (hasChild(id, parentId, this.children)) {
      return
    }

    this.children[parentId] = [...children, id]
    this.parents[id] = [...(this.parents[id] ?? []), parentId]
    this.trigger()
  }
  
  recalculateAutodone(id: number) {
    const queue = [id]
    const visited: {[id: number]: true } = {}

    while (queue.length > 0) {
      const current = queue.shift()
      
      if (!current)
        continue

      if (visited[current]) {
        continue
      }
      
      visited[current] = true
      
      const task = this.tasks[current]

      if (task.isAutodone) {
        const childrenIds = this.children[task.id] || []

        let isEveryTaskDone = true
        for (let i = 0; i < childrenIds.length; i++) {
          const child = this.tasks[childrenIds[i]]
          if (!child.isDone) {
            isEveryTaskDone = false
          }
        }
        
        if (task.isDone !== isEveryTaskDone) {
          this.setDone(task.id, isEveryTaskDone)
        }
      }
      
      const parents = this.parents[task.id] || []
      
      for (let i = 0; i < parents.length; i++) {
        const parent = parents[i]
        queue.push(parent)
      }
    }
  }

  setDone(id: number, isDone: boolean) {
    const task = this.tasks[id]

    this.setTask({ ...task, isDone })
    this.recalculateAutodone(id)
  }
  
  setIsPriorityList(id: number, isPriorityList: boolean): void {
    const task = this.tasks[id]
    this.setTask({ ...task, isPriorityList })
  }
  
  setIsAutodone(id: number, isAutodone: boolean): void {
    const task = this.tasks[id]
    this.setTask({ ...task, isAutodone })
    this.recalculateAutodone(id)
  }

  setTitle(id: number, title: string): void {
    const task = this.tasks[id]

    this.setTask({
      ...task,
      title
    })
  }

  setDescription(id: number, description: string): void {
    const task = this.tasks[id]

    this.setTask({
      ...task,
      description
    })
  }

  setResult(id: number, result: string): void {
    const task = this.tasks[id]

    this.setTask({
      ...task,
      result
    })
  }

  getTree(rootId: number, showCompleted: boolean, hideBlocked: boolean): Accessor<{
    relations: Relation[]; unlocked: number[];
    updatedTime: Date;
  }> {
    const [rels, setRels] = createSignal<{
      relations: Relation[], unlocked: number[], updatedTime: Date
    }>({ relations: [], unlocked: [], updatedTime: new Date() })

    const upd = () => {
      const queue = [{ id: rootId, priority: 2 }]
      // 0 | undefined = not visited
      // 1 = visited with low priority
      // 2 = visited with high priority
      const visited: { [key: number]: number } = {}
      const result: Relation[] = []
      const leaves: number[] = []
      const leavesHash: { [key: number]: boolean } = {}
      let updateOn: Date | null = null
      let skipResult = false

      while (queue.length > 0) {
        const current = queue.shift()
        if (!current) continue
        const { id, priority } = current
        skipResult = Boolean(visited[id])
        if (visited[id] && visited[id] >= priority) {
          continue
        }
        visited[id] = priority
        const children = this.children[id]
        if (!children || children.length === 0 || (!showCompleted && children.every(id => this.tasks[id].isDone))) {
          if (!leavesHash[id]) {
            leaves.push(id)
            leavesHash[id] = true
          }
        }
        if (children) {
          const task = this.tasks[id]
          const priorityParent = task ? this.tasks[id].isPriorityList : false
          let isHighPriority = true
          for (let i = 0; i < children.length; i++) {
            const child = children[i]
            
            if (hideBlocked) {
              const until = isEveryLeafDelayed(this, child)
              if (until) {
                updateOn = nullableMinDate(updateOn, until)
                continue
              } 
            }

            const task = this.tasks[child]

            if (task) {
              if (!showCompleted && task.isDone) {
                continue
              }
            }
            const isDone = task.isDone
            if (!skipResult) {
              result.push({
                taskId: id,
                dependsOnId: child
              })
            }
            queue.unshift({
              id: child,
              priority: isDone ? 1 :
                (isHighPriority || !priorityParent ? priority : 1),
            })
            
            if (!isDone) {
              if (!isSubTreeDelayed(this, child)) {
                isHighPriority = false
              }
            }
          }
        }
      }
      const unlocked = []
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i]
        if (visited[leaf] !== 2) continue
        const task = this.tasks[leaf]
        if (task && task.postponedUntil && task.postponedUntil > new Date()) {
          updateOn = nullableMinDate(updateOn, task.postponedUntil)
          continue
        }
        unlocked.push(leaf)
      }
      
      if (updateOn) {
        setTimeout(() => {
          upd()
        }, (updateOn.valueOf() - new Date().valueOf()))
      }
      
      setRels({ relations: result, unlocked, updatedTime: new Date() })
    }

    upd()
    this.onUpdate(upd)


    return rels
  }
  
  getAletrnativePath(id: number, parentId: number): Accessor<Task[]> {
    const [tasks, setTasks] = createSignal<Task[]>([])
    
    const upd = () => {
      const children = this.children[parentId]
      const tasks: Task[] = []
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child === id) {
          continue
        }
        
        if (hasChild(child, id, this.children)) {
          tasks.push(this.tasks[child])
        }
      }
      
      setTasks(() => tasks)
    }
    
    upd()
    
    this.onUpdate(upd)

    return tasks
  }
  
  postpone(id: number, until: Date | null): void {
    const task = this.tasks[id]
    this.setTask({
      ...task,
      postponedUntil: until
    })
  }
}
