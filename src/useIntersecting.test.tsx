import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import useIntersecting from "./useIntersecting"

describe("useIntersecting", () => {
  let targetRef = null as any
  const window = global as any
  let mockObserve: jest.Mock
  let mockUnobserve: jest.Mock

  beforeAll(() => {
    targetRef = { current: <div /> }
  })

  describe("observe and unobserve methods", () => {
    beforeEach(() => {
      mockObserve = jest.fn()
      mockUnobserve = jest.fn()
    })
    beforeAll(() => {
      window.IntersectionObserver = jest.fn((callback, options) => ({
        observe: mockObserve,
        unobserve: mockUnobserve,
      }))
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
    it("should call observe when targetRef is passed", () => {
      renderHook(() => useIntersecting({ targetRef, hasMore: true }))
      expect(mockObserve).toHaveBeenCalledTimes(1)
      expect(mockUnobserve).toHaveBeenCalledTimes(0)
    })

    it("should call unobserve method only on unmount", () => {
      const { unmount } = renderHook(() =>
        useIntersecting({ targetRef, hasMore: true }),
      )
      expect(mockUnobserve).toHaveBeenCalledTimes(0)
      unmount()
      expect(mockUnobserve).toHaveBeenCalledTimes(1)
    })
  })

  describe("isIntersecting", () => {
    it("should return true if intersecting and more to fetch", () => {
      window.IntersectionObserver = jest.fn((callback) => {
        callback([{ isIntersecting: true }])
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
        }
      })
      const { result } = renderHook(() =>
        useIntersecting({ targetRef, hasMore: true }),
      )
      expect(result.current).toBeTruthy()
    })

    it("should return false if not intersecting and nothing left to fetch", () => {
      window.IntersectionObserver = jest.fn((callback) => {
        callback([{ isIntersecting: false }])
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
        }
      })
      const { result } = renderHook(() =>
        useIntersecting({ targetRef, hasMore: false }),
      )
      expect(result.current).toBeFalsy()
    })
  })
})
