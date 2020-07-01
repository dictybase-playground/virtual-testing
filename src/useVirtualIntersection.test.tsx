import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import useVirtualIntersection from "./useVirtualIntersection"

describe("useVirtualIntersection", () => {
  describe("virtual list", () => {
    let parentRef = null as any
    let targetRef = null as any
    const window = global as any

    beforeAll(() => {
      parentRef = { current: null }
      targetRef = { current: null }
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
    describe("items returned", () => {
      window.IntersectionObserver = jest.fn((callback, options) => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
      }))
      const { result } = renderHook(() =>
        useVirtualIntersection({
          parentRef,
          targetRef,
          rowHeight: 30,
          numItems: 100,
          viewportHeight: 300,
          hasMore: true,
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

    describe("items returned with overscan", () => {
      const { result } = renderHook(() =>
        useVirtualIntersection({
          parentRef,
          targetRef,
          rowHeight: 30,
          numItems: 100,
          viewportHeight: 300,
          overscan: 2,
          hasMore: true,
        }),
      )
      const items = result.current.items
      it("should return correct amount of items", () => {
        // same as previous test but with two rows below
        expect(items.length).toBe(13)
      })
      it("should have correctly calculated transform values", () => {
        expect(items[0].style.transform).toBe("translateY(0px)")
        expect(items[10].style.transform).toBe("translateY(300px)")
        expect(items[12].style.transform).toBe("translateY(360px)")
      })
    })
  })

  describe("intersection observer", () => {
    let parentRef = null as any
    let targetRef = null as any
    const window = global as any
    let mockObserve: jest.Mock
    let mockUnobserve: jest.Mock

    beforeAll(() => {
      parentRef = { current: null }
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
      it("should call observe when ref is passed", () => {
        renderHook(() =>
          useVirtualIntersection({
            parentRef,
            targetRef,
            hasMore: true,
            rowHeight: 30,
            numItems: 100,
            viewportHeight: 300,
          }),
        )
        expect(mockObserve).toHaveBeenCalledTimes(1)
        expect(mockUnobserve).toHaveBeenCalledTimes(0)
      })

      it("should call unobserve method only on unmount", () => {
        const { unmount } = renderHook(() =>
          useVirtualIntersection({
            parentRef,
            targetRef,
            hasMore: true,
            rowHeight: 30,
            numItems: 100,
            viewportHeight: 300,
          }),
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
          useVirtualIntersection({
            parentRef,
            targetRef,
            hasMore: true,
            rowHeight: 30,
            numItems: 100,
            viewportHeight: 300,
          }),
        )
        expect(result.current.intersecting).toBeTruthy()
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
          useVirtualIntersection({
            parentRef,
            targetRef,
            hasMore: false,
            rowHeight: 30,
            numItems: 100,
            viewportHeight: 300,
          }),
        )
        expect(result.current.intersecting).toBeFalsy()
      })
    })
  })
})
