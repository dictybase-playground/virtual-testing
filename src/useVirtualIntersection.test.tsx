import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import {
  render,
  screen,
  fireEvent,
  queryByTestId,
  getAllByRole,
} from "@testing-library/react"
import useVirtualIntersection from "./useVirtualIntersection"

const data = Array.from(Array(15).keys(), (n) => n + 1)

const VirtualList = () => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const targetRef = React.useRef<HTMLDivElement>(null)
  const { items, intersecting } = useVirtualIntersection({
    parentRef,
    targetRef,
    viewportHeight: 310,
    rowHeight: 35,
    overscan: 2,
    numItems: data.length,
    hasMore: true,
  })

  const innerHeight = data.length * 35

  return (
    <div data-testid="parent" ref={parentRef}>
      <ul style={{ position: "relative", height: `${innerHeight}px` }}>
        {items.map((item) => {
          return (
            <li
              key={item.index}
              // @ts-ignore
              style={item.style}
              data-testid={`row-${item.index}`}>
              Row {data[item.index]}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

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

  describe("scrolling", () => {
    const window = global as any
    window.IntersectionObserver = jest.fn((callback, options) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
    }))

    render(<VirtualList />)

    const parent = screen.getByTestId("parent")
    jest.spyOn(parent, "scrollTop", "get").mockImplementation(() => 300)
    fireEvent.scroll(parent)

    /**
     * Scrolling down 300px in this case would make the following:
     * startIndex = 6 because (300 / 35) - 2
     * endIndex = 14 because 15 - 1 where 15 is numItems
     */

    it("should no longer display first row", () => {
      expect(queryByTestId(parent, "row-1")).toBeFalsy()
    })
    it("should not display row with index 5", () => {
      expect(queryByTestId(parent, "row-5")).toBeFalsy()
    })
    it("should start with row with index 6", () => {
      expect(queryByTestId(parent, "row-6")).toBeTruthy()
    })
    it("should show nine list items", () => {
      expect(getAllByRole(parent, "listitem").length).toBe(9)
    })
    it("should not display more rows than the length of data set", () => {
      expect(queryByTestId(parent, "row-15")).toBeFalsy()
    })
  })
})
