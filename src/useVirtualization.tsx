import React from "react"

type ConfigParams = {
  windowHeight: number
  rowHeight: number
  numItems: number
  overscan?: number
}

const useVirtualization = ({
  windowHeight = 310,
  rowHeight = 35,
  numItems,
  overscan,
}: ConfigParams) => {
  const [scrollTop, setScrollTop] = React.useState(0)

  const startIndex = Math.floor(scrollTop / rowHeight)
  const endIndex = Math.min(
    numItems - 1, // don't render past the end of the list
    Math.floor((scrollTop + windowHeight) / rowHeight),
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
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }

  return { items, handleScroll }
}

export default useVirtualization
