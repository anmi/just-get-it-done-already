export interface Relation {
  taskId: number;
  dependsOnId: number;
}

type DirectedRelationsHash = {
  [id: number]: number[];
};

type RelationsHash = {
  children: DirectedRelationsHash;
  parents: DirectedRelationsHash;
};

export function getRelationsMappings(relations: Relation[]): RelationsHash {
  const children: { [id: number]: number[] } = {};
  const parents: { [id: number]: number[] } = {};
  for (let i = 0; i < relations.length; i++) {
    const rel = relations[i];
    if (!children[rel.taskId]) {
      children[rel.taskId] = [];
    }
    if (!parents[rel.dependsOnId]) {
      parents[rel.dependsOnId] = [];
    }

    children[rel.taskId].push(rel.dependsOnId);
    parents[rel.dependsOnId].push(rel.taskId);
  }

  return { children, parents };
}

