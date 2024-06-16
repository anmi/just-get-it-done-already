export interface Task {
  id: number;
  title: string;
  description: string;
  result: string;
  isDone: boolean
  postponedUntil: Date | null;
}

export interface TaskDraft {
  title: string;
  description: string;
  result: string;
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
