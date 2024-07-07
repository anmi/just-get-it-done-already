import { Accessor, Setter } from "solid-js";
import { Task, TaskDraft } from "../models/Task";

interface Relation {
  taskId: number;
  dependsOnId: number;
}

export interface Store {
  getRootId(): number
  createTask(parentId: number, draft: TaskDraft): void
  getChildren(parentId: number): Accessor<number[]>
  getTask(id: number): Accessor<Task>
  unlink(id: number, parentId: number): void
  link(id: number, parentId: number, positionId?: number): void
  setDone(id: number, isDone: boolean): void
  setIsPriorityList(id: number, isPriorityList: boolean): void
  setTitle(id: number, title: string): void
  setDescription(id: number, description: string): void
  setResult(id: number, description: string): void
  getTree(rootId: number, showCompleted: boolean): Accessor<{ relations: Relation[] }>
  
  updateFromJSON(value: string): void
}