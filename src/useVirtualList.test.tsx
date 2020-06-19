import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import useVirtualList from "./useVirtualList"

describe("useVirtualList", () => {
  let ref = null as any

  beforeAll(() => {
    ref = jest.spyOn(React, "useRef").mockReturnValueOnce({ current: null })
  })

  describe("items returned", () => {
    const { result } = renderHook(() =>
      useVirtualList({
        ref,
        rowHeight: 30,
        numItems: 100,
        viewportHeight: 300,
      }),
    )
    const items = result.current.items
    it("should return correct amount of items", () => {
      expect(items.length).toBe(11) // (300 / 30) + 1
    })
    it("should have correctly calculated transform values", () => {
      expect(items[0].style.transform).toBe("translateY(0px)")
      expect(items[10].style.transform).toBe("translateY(300px)")
    })
  })
})
