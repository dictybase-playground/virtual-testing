import React from "react"
import useVirtualIntersection from "./useVirtualIntersection"

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
    }
  }, [intersecting])

  return (
    <div
      id="parent-ref"
      data-testid="parent"
      ref={parentRef}
      style={{ height: "310px", overflow: "auto" }}>
      <ul style={{ position: "relative", height: `${data.length * 35}px` }}>
        {items.map((item) => {
          if (data.length - 1 === item.index) {
            return (
              <li
                key={item.index}
                // @ts-ignore
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

export default VirtualList
