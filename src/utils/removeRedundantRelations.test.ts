import { filter } from "fp-ts/lib/Filterable"
import { TaskRelation } from "openapi"
import { expect } from "vitest"
import { removeRedundantRelations } from "./removeRedundantRelations"

describe("removeRedundantRelations", () => {
  it("Should remove redundant relations", () => {
    const relations: TaskRelation[] = [
      { taskId: 1, dependsOnId: 2, order: 0 },
      { taskId: 2, dependsOnId: 3, order: 0 },
      { taskId: 1, dependsOnId: 3, order: 0 },
      { taskId: 1, dependsOnId: 4, order: 0 },
      { taskId: 4, dependsOnId: 5, order: 0 },
      { taskId: 1, dependsOnId: 5, order: 0 },
      { taskId: 5, dependsOnId: 6, order: 0 },
      { taskId: 6, dependsOnId: 7, order: 0 },
    ]
    const filtered = removeRedundantRelations(1, relations)
    expect(filtered).toStrictEqual({
      filtered: [
        { taskId: 1, dependsOnId: 2, order: 0 },
        { taskId: 2, dependsOnId: 3, order: 0 },
        //{taskId: 1, dependsOnId: 3, order: 0},
        { taskId: 1, dependsOnId: 4, order: 0 },
        { taskId: 4, dependsOnId: 5, order: 0 },
        //{taskId: 1, dependsOnId: 5, order: 0},
        { taskId: 5, dependsOnId: 6, order: 0 },
        { taskId: 6, dependsOnId: 7, order: 0 },
      ],
      removed: [
        { taskId: 1, dependsOnId: 3, order: 0 },
        { taskId: 1, dependsOnId: 5, order: 0 },
      ]
    })
  })
})
