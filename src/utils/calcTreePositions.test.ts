import { describe, it, expect, assert } from "vitest";
import {
  calcTreeBranchesWidth,
  calcXPosition,
  getMaxPaths,
  getRelationsMappings,
  getShortestPathsTree,
} from "./calcTreePositions";

function rel(
  taskId: number,
  dependsOnId: number
): { taskId: number; dependsOnId: number } {
  return { taskId, dependsOnId };
}

/**
 *        1 --
 *       / \   \
 *      |   3   6
 *      |   |\ / \
 *      |   4 5   7
 *      | /
 *      2
 */
const relations: { taskId: number; dependsOnId: number }[] = [
  rel(1, 2),
  rel(1, 3),
  rel(1, 6),
  rel(3, 4),
  rel(4, 2),
  rel(3, 5),
  rel(6, 5),
  rel(6, 7),
];

describe("calcTreePositions", () => {
  it("Should calculate max paths rating for each node", () => {
    const ratings = getMaxPaths(1, getRelationsMappings(relations));
    assert.deepEqual(ratings, {
      1: 0,
      3: 1,
      4: 2,
      5: 2,
      2: 3,
      6: 1,
      7: 2,
    });
  });

  it("Should calculate shortest paths tree", () => {
    const tree = getShortestPathsTree(1, getRelationsMappings(relations));
    assert.deepEqual(tree, {
      "1": [2, 3, 6],
      "2": [],
      "3": [4, 5],
      "4": [],
      "5": [],
      "6": [7],
      "7": [],
    });
  });

  it("Should calculate width of each tree branch", () => {
    const widths = calcTreeBranchesWidth(
      1,
      getShortestPathsTree(1, getRelationsMappings(relations))
    );
    assert.deepEqual(widths, {
      1: 4,
      2: 1,
      3: 2,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
    });
  });

  it("Should calculate horizontal position", () => {
    const positions = calcXPosition(
      1,
      getShortestPathsTree(1, getRelationsMappings(relations))
    );
    assert.deepEqual(positions, {
      1: 1.5,
      2: 0,
      3: 1.5,
      4: 1,
      5: 2,
      6: 3,
      7: 3,
    });
  });

});
