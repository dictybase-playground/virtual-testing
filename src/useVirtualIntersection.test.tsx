import React from "react"
import { renderHook } from "@testing-library/react-hooks"
import {
  render,
  screen,
  fireEvent,
  queryByTestId,
  getAllByRole,
  waitFor,
} from "@testing-library/react"
import useVirtualIntersection from "./useVirtualIntersection"

describe("useVirtualIntersection", () => {
  describe("virtual list", () => {
    let parentRef = null as any
    const window = global as any

    beforeAll(() => {
      parentRef = { current: null }
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
    describe("items returned", () => {
      window.IntersectionObserver = jest.fn((callback, options) => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
      }))
      const { result } = renderHook(() =>
        useVirtualIntersection({
          parentRef,
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
    const window = global as any
    let mockObserve: jest.Mock
    let mockDisconnect: jest.Mock

    beforeAll(() => {
      parentRef = { current: null }
    })
    describe("observe and disconnect methods", () => {
      beforeEach(() => {
        mockObserve = jest.fn()
        mockDisconnect = jest.fn()
      })
      beforeAll(() => {
        window.IntersectionObserver = jest.fn((callback, options) => ({
          observe: mockObserve,
          disconnect: mockDisconnect,
        }))
      })
      afterEach(() => {
        jest.clearAllMocks()
      })
      it("should call observe when ref is passed", () => {
        renderHook(() =>
          useVirtualIntersection({
            parentRef,
            hasMore: true,
            rowHeight: 30,
            numItems: 100,
            viewportHeight: 300,
          }),
        )
        expect(mockObserve).toHaveBeenCalledTimes(1)
        expect(mockDisconnect).toHaveBeenCalledTimes(0)
      })

      it("should call disconnect method only on unmount", () => {
        const { unmount } = renderHook(() =>
          useVirtualIntersection({
            parentRef,
            hasMore: true,
            rowHeight: 30,
            numItems: 100,
            viewportHeight: 300,
          }),
        )
        expect(mockDisconnect).toHaveBeenCalledTimes(0)
        unmount()
        expect(mockDisconnect).toHaveBeenCalledTimes(1)
      })
    })

    describe("isIntersecting", () => {
      it("should return true if intersecting and more to fetch", () => {
        window.IntersectionObserver = jest.fn((callback) => {
          callback([{ isIntersecting: true }])
          return {
            observe: mockObserve,
            disconnect: mockDisconnect,
          }
        })
        const { result } = renderHook(() =>
          useVirtualIntersection({
            parentRef,
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
            disconnect: mockDisconnect,
          }
        })
        const { result } = renderHook(() =>
          useVirtualIntersection({
            parentRef,
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
    let testfn = jest.fn()
    const VirtualList = () => {
      const [data, setData] = React.useState(
        Array.from(Array(15).keys(), (n) => n + 1),
      )
      const parentRef = React.useRef<HTMLDivElement>(null)
      // const targetRef = React.useRef<HTMLLIElement>(null)
      const { items, intersecting, setTargetRef } = useVirtualIntersection({
        parentRef,
        viewportHeight: 310,
        rowHeight: 35,
        overscan: 2,
        numItems: data.length,
        hasMore: true,
      })

      const fetchMore = () => {
        setTimeout(() => {
          setData((prevState) => [
            ...prevState,
            ...Array.from(Array(15).keys(), (n) => n + prevState.length + 1),
          ])
        }, 200)
      }

      React.useEffect(() => {
        if (intersecting) {
          console.log("intersecting")
          fetchMore()
          testfn()
        }
      }, [intersecting])

      return (
        <div
          data-testid="parent"
          ref={parentRef}
          style={{ height: "310px", overflow: "auto" }}>
          <ul style={{ position: "relative", height: `${data.length * 35}px` }}>
            {items.map((item) => {
              if (data.length - 1 === item.index) {
                return (
                  <li
                    key={item.index}
                    ref={setTargetRef}
                    // @ts-ignore
                    style={item.style}
                    data-testid={`row-${item.index}`}>
                    Row {data[item.index]}
                  </li>
                )
              }

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

    const window = global as any
    window.IntersectionObserver = jest.fn((callback, options) => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))

    /**
     * Scrolling down 300px in this case would make the following:
     * startIndex = 6 because (300 / 35) - 2
     * endIndex = 14 because 15 - 1 where 15 is numItems
     */

    it("should display correct rows on scroll", () => {
      render(<VirtualList />)
      const parent = screen.getByTestId("parent")
      jest.spyOn(parent, "scrollTop", "get").mockImplementation(() => 300)
      fireEvent.scroll(parent)
      expect(queryByTestId(parent, "row-1")).toBeFalsy()
      expect(queryByTestId(parent, "row-5")).toBeFalsy()
      // start with row-6
      expect(queryByTestId(parent, "row-6")).toBeTruthy()
      // end at row-14
      expect(queryByTestId(parent, "row-15")).toBeFalsy()
      // shows all nine items
      expect(getAllByRole(parent, "listitem").length).toBe(9)
    })
    it("should load next items", async () => {
      render(<VirtualList />)
      const parent = screen.getByTestId("parent")
      jest.spyOn(parent, "scrollTop", "get").mockImplementation(() => 400)
      fireEvent.scroll(parent)
      // screen.debug()
      await waitFor(() => expect(testfn).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(queryByTestId(parent, "row-16")).toBeTruthy())
      screen.debug()
    })
    // it("should load next items", async () => {
    //   await waitFor(() => expect(queryByTestId(parent, "row-16")).toBeTruthy())
    // })
  })
})
