export interface Task {
  id: number;
  title: string;
  description: string;
  result: string;
  isDone: boolean
  postponedUntil: Date | null;
  isPriorityList: boolean;
}

export interface TaskDraft {
  title: string;
  description: string;
  result: string;
  isPriorityList: boolean;
}

export const taskMethods = {
  serialize: (task: Task) => {
    return {
      ...task,
      postponedUntil: task.postponedUntil ? task.postponedUntil.valueOf() : null
    }
  },
  deserialize: (str: string | Object) => {
    const parsed = typeof str === 'string' ? JSON.parse(str) : str

    return {
      ...parsed,
      postponedUntil: parsed.postponedUntil ? new Date(parsed.postponedUntil) : null
    }
  }
}
