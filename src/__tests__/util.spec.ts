import { randFromRange } from "../util"

describe("Random Number From Range", () => {
  const randMock = jest.spyOn(global.Math, "random").mockImplementation(() => 0.1)

  it("should round to integer by default", () => {
    expect(Number.isInteger(randFromRange(0, 2))).toEqual(true)
  })
  it("should exclude upper bound", () => {
    const lower = 0
    const upper = 3
    randMock.mockImplementation(() => 0.999999999)
    expect(randFromRange(lower, upper)).toBeLessThan(upper)
  })
})
