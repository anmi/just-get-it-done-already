import { getRelationsMappings } from "./getRelationsMappings";

function serializeRelation(r: Relation) {
  return `${r.taskId}:${r.dependsOnId}`
}

interface Relation {
  taskId: number;
  dependsOnId: number;
}

interface Frame {
  id: number;
  children: number[];
}

export function removeRedundantRelations(rootId: number, relations: Relation[]) {
  const mappings = getRelationsMappings(relations);
  const existingRelsHash: { [key: string]: true } = {};
  for (let i = 0; i < relations.length; i++) {
    const rel = relations[i]
    existingRelsHash[serializeRelation(rel)] = true
  }
  const toRemove: { [key: string]: true } = {};
  const initialFrame: Frame = {
    id: rootId,
    children: (mappings.children[rootId] || []).slice()
  }
  const stack = [initialFrame]

  while (stack.length) {
    const current = stack.pop()!
    for (let i = 0; i < stack.length - 1; i++) {
      const key = serializeRelation({ taskId: stack[i].id, dependsOnId: current.id })
      if (existingRelsHash[key]) {
        toRemove[key] = true
      }
    }

    if (current.children.length) {
      const child = current.children.shift()!
      stack.push(current)

      stack.push({
        id: child,
        children: (mappings.children[child] || []).slice()
      })
    }
  }

  const filtered: Relation[] = []
  const removed: Relation[] = []
  for (let i = 0; i < relations.length; i++) {
    const rel = relations[i]
    if (!toRemove[serializeRelation(rel)]) {
      filtered.push(rel)
    } else {
      removed.push(rel)
    }
  }

  return {filtered, removed}
}

