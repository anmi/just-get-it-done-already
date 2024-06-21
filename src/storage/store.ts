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
    link(id: number, parentId: number): void
    setDone(id: number, isDone: boolean): void
    setDescription(id: number, description: string): void
    getTree(rootId: number): Accessor<{ relations: Relation[] }>
}