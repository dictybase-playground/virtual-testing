import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import useVirtualization from "./useVirtualization"

describe("useVirtualization", () => {
  describe("items returned", () => {
    const { result } = renderHook(() =>
      useVirtualization({
        rowHeight: 30,
        numItems: 100,
        windowHeight: 300,
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
