import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import useIntersecting from "./useIntersecting"

describe("useIntersecting", () => {
  let ref = null as any
  const window = global as any
  let mockObserve = jest.fn()
  let mockUnobserve = jest.fn()

  beforeEach(() => {
    ref = jest.spyOn(React, "useRef").mockReturnValueOnce({ current: null })
    // necessary to redefine so mocks can be cleared
    mockObserve = jest.fn()
    mockUnobserve = jest.fn()
  })

  beforeAll(() => {
    window.IntersectionObserver = jest.fn((callback, options) => ({
      thresholds: Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold],
      root: options.root,
      rootMargin: options.rootMargin,
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: jest.fn(),
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should call observe when ref is passed", () => {
    renderHook(() => useIntersecting({ ref, hasMore: true }))
    expect(mockObserve).toHaveBeenCalledTimes(1)
    expect(mockUnobserve).toHaveBeenCalledTimes(0)
  })
  it("should call unobserve method only on unmount", () => {
    const { unmount } = renderHook(() =>
      useIntersecting({ ref, hasMore: false }),
    )
    expect(mockUnobserve).toHaveBeenCalledTimes(0)
    unmount()
    expect(mockUnobserve).toHaveBeenCalledTimes(1)
  })
})
