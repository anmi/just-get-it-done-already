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
    return JSON.stringify(task)
  },
  deserialize: (str: string) => {
    const parsed = JSON.parse(str)

    return {
      ...parsed,
      postponedUntil: parsed.postponedUntil ? new Date(parsed.postponedUntil) : null
    }
  }
}
