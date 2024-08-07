import { removeRedundantRelations } from "./removeRedundantRelations";

interface Relation {
  taskId: number;
  dependsOnId: number;
}

// 1. Calc longest path for each relation, save by id
// 2. Cut all the long paths, leave only shortest
// 3. Traverse on tree from root, calc width of each branch
// 4. Walk through tree, set x positions for each leaf
// 5. Walk through tree, set x positions for all the remaining branches
// Improvement suggest: get width of each task individually

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

type TasksScalar = { [id: number]: number };

export function getMaxPaths(
  rootId: number,
  relationsHash: RelationsHash
): TasksScalar {
  const queue = [rootId];
  const maxPathsHash: { [id: number]: number } = {
    [rootId]: 0,
  };

  while (queue.length > 0) {
    const head = queue.shift()!;
    const depth = maxPathsHash[head];
    const children = relationsHash.children[head] || [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      maxPathsHash[child] = depth + 1;
      queue.push(child);
    }
  }

  return maxPathsHash;
}

export function getShortestPathsTree(rootId: number, relations: RelationsHash) {
  const rels: DirectedRelationsHash = {};
  const queue = [rootId];
  const added: { [id: number]: true } = { [rootId]: true };

  while (queue.length > 0) {
    const head = queue.shift()!;
    const children = relations.children[head] || [];

    rels[head] = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (!added[child]) {
        rels[head].push(child);
        queue.push(child);
        added[child] = true;
      }
    }
  }

  return rels;
}

export function calcTreeBranchesWidth(
  rootId: number,
  spt: DirectedRelationsHash
) {
  const widths: TasksScalar = {};
  const stack = [rootId];

  while (stack.length) {
    const current = stack.pop()!;
    const children = spt[current];
    let hasAllBranchesCalculated = true;
    if (!children.length) {
      widths[current] = 1;
      continue;
    }
    let widthSum = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (widths[child] === undefined) {
        hasAllBranchesCalculated = false;
      } else {
        widthSum += widths[child];
      }
    }
    if (hasAllBranchesCalculated) {
      widths[current] = widthSum;
      continue;
    }

    stack.push(current);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      stack.push(child);
    }
  }

  return widths;
}

interface Link {
  current: number;
  next: Link | null;
}

function link(current: number, next: Link | null = null) {
  return { current, next };
}

export function calcBreadthPosition(rootId: number, spt: DirectedRelationsHash) {
  // const stack = [link(rootId)]
  const positions: TasksScalar = {};

  // Leaf positions
  const stack = [rootId];
  let currentPosition = 0;
  while (stack.length) {
    const current = stack.pop()!;
    const children = spt[current] || [];
    if (!children.length) {
      positions[current] = currentPosition;
      currentPosition++;
      continue;
    }
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      stack.push(child);
    }
  }
  // Branches position
  stack.push(rootId);
  while (stack.length) {
    const current = stack.pop()!;
    const children = spt[current] || [];
    let hasAllBranchesCalculated = true;
    let max = -Infinity;
    let min = Infinity;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (positions[child] === undefined) {
        hasAllBranchesCalculated = false;
        break;
      } else {
        max = Math.max(positions[child], max);
        min = Math.min(positions[child], min);
      }
    }
    if (hasAllBranchesCalculated) {
      positions[current] = (min + max) / 2;
      continue;
    }
    stack.push(current);
    for (let i = 0; i < children.length; i++) {
      if (positions[children[i]] === undefined) {
        stack.push(children[i]);
      }
    }
  }

  return positions;
}

type IdBoolHash = {
  [id: string]: true
}

type RedundantHash = {
  [id: string]: IdBoolHash
}

export function isRedundant(hash: RedundantHash, rel: Relation) {
  if (hash[rel.taskId] && hash[rel.taskId][rel.dependsOnId]) {
    return true
  }

  return false
}

export function shiftPositionsToBottom(
  rootId: number,
  depthPositions: TasksScalar,
  relsMaps: RelationsHash,
  unlocked: number[]
) {
  let leaves = []
  let maxDepth = 0
  const allElements = Object.keys(depthPositions)
  for (let i = 0; i < allElements.length; i++) {
    const item = parseInt(allElements[i], 10)
    const children = relsMaps.children[item]
    if (!children || children.length === 0) {
      leaves.push(item)
      maxDepth = Math.max(maxDepth, depthPositions[item])
    }
  }

  let queue = leaves.map(id => ({
    id,
    level: unlocked.includes(id) ? maxDepth : maxDepth - 1
  }))
  let newDepths: TasksScalar = {}

  let hasNegativeDepth = false;
  while (queue.length) {
    const item = queue.shift()
    if (!item) break

    const depth = Math.min(newDepths[item.id] ?? maxDepth, item.level)
    if (depth < 0) {
      hasNegativeDepth = true
    }
    newDepths[item.id] = depth

    const parents = relsMaps.parents[item.id] || []

    for (let i = 0; i < parents.length; i++) {
      const parent = parents[i]
      queue.push({
        id: parent,
        level: item.level - 1
      })
    }
  }
  
  if (hasNegativeDepth) {
    const keys = Object.keys(newDepths).map(k => parseInt(k, 10))
    
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i]
      newDepths[id] = newDepths[id] + 1
    }
  }

  return newDepths
}

interface Params {
  flipDepth: boolean
  shiftDepths: boolean
  unlocked: number[]
}

export function calcTreePositions(rootId: number, relations: Relation[], params: Params) {
  const shiftDepths = params.shiftDepths
  const flipDepth = params.flipDepth
  const rels = removeRedundantRelations(rootId, relations)
  const mappings = getRelationsMappings(
    rels.filtered
  );
  const redundantHash: RedundantHash = {}
  for (let i = 0; i < rels.removed.length; i++) {
    const rel = rels.removed[i]
    redundantHash[rel.taskId] = redundantHash[rel.taskId] || {}
    redundantHash[rel.taskId][rel.dependsOnId] = true
  }
  let depthPositions = getMaxPaths(rootId, mappings);
  if (shiftDepths) {
    depthPositions = shiftPositionsToBottom(rootId, depthPositions, mappings, params.unlocked)
  }
  const spt = getShortestPathsTree(rootId, mappings);
  const breadthPositions = calcBreadthPosition(rootId, spt);
  const positions: { [id: number]: { x: number; y: number } } = {};
  const elementsList: number[] = [];

  const queue = [rootId];
  let maxY = 0;
  let maxX = 0;
  while (queue.length) {
    const head = queue.shift()!;
    elementsList.push(head);
    const x = depthPositions[head] * 200 + 20;
    const y = breadthPositions[head] * 50 + 20;
    maxY = Math.max(y, maxY);
    maxX = Math.max(x, maxX);

    positions[head] = {
      x,
      y,
    };
    spt[head].forEach((id) => {
      queue.push(id);
    });
  }

  if (flipDepth) {
    const keys = Object.keys(positions)
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const position = positions[key as any]
      
      positions[key as any] = {
        ...position,
        x: maxX - position.x,
      }
    }
  }

  return {
    elementsList,
    positions,
    redundantHash,
    maxY: maxY + 100,
    maxX: maxX + 200,
  };
}
