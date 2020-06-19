import React from "react"

type ConfigParams = {
  ref: React.MutableRefObject<any>
  viewportHeight: number
  rowHeight: number
  numItems: number
  overscan?: number
}

const useVirtualList = ({
  ref,
  viewportHeight,
  rowHeight,
  numItems,
  overscan,
}: ConfigParams) => {
  const [scrollTop, setScrollTop] = React.useState(0)

  const startIndex = Math.floor(scrollTop / rowHeight)
  const endIndex = Math.min(
    numItems - 1, // don't render past the end of the list
    Math.floor((scrollTop + viewportHeight) / rowHeight),
  )
  const items = []
  for (let i = startIndex; i <= endIndex; i++) {
    items.push({
      index: i,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${rowHeight}px`,
        transform: `translateY(${i * rowHeight}px)`,
      },
    })
  }

  // scrollTop measures how far the inner container is scrolled;
  // it is the distance between the top of the inner container and its
  // visible part
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }

  React.useEffect(() => {
    if (ref && ref.current) {
      const element = ref.current
      element.onscroll = handleScroll
    }
  }, [ref])

  return { items }
}

export default useVirtualList
