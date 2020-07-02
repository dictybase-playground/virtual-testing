import React from "react"

type ConfigParams = {
  /** React ref for element that is used as viewport for checking visibility of target */
  parentRef: React.MutableRefObject<any>
  /** Height of the scrollable area (inner container) */
  viewportHeight: number
  /** Height of individual row */
  rowHeight: number
  /** Number of items in total */
  numItems: number
  /** Number of elements to render above and below viewport */
  overscan?: number
  /** Margin around the root */
  rootMargin?: string
  /** Indicates the percentage of the target's visibility the observer's
   * callback should be executed */
  threshold?: number
  /** Indicates whether there are more items to fetch */
  hasMore: boolean
}

const useVirtualIntersection = ({
  parentRef,
  viewportHeight,
  rowHeight,
  numItems,
  overscan,
  rootMargin = "0px",
  threshold = 0.25,
  hasMore,
}: ConfigParams) => {
  /**
   * scrollTop measures how far the inner container is scrolled.
   * It is the difference between the total list height and the viewport
   * height.
   */
  const [scrollTop, setScrollTop] = React.useState(0)
  const [intersecting, setIntersecting] = React.useState(false)
  const [targetRef, setTargetRef] = React.useState(null)
  const observerRef = React.useRef<any>(null)

  let startIndex = Math.floor(scrollTop / rowHeight)
  let endIndex = Math.min(
    numItems - 1, // don't render past the end of the list
    Math.floor((scrollTop + viewportHeight) / rowHeight),
  )

  if (overscan) {
    // take zero or the index minus overscan, whichever is higher
    startIndex = Math.max(0, startIndex - overscan)
    // if end of list, don't display the extra elements
    endIndex = Math.min(numItems - 1, endIndex + overscan)
  }

  const items = []
  for (let i = startIndex; i <= endIndex; i++) {
    items.push({
      // index is required so we know the exact row of data to display
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

  React.useEffect(() => {
    if (parentRef && parentRef.current) {
      const element = parentRef.current
      element.addEventListener("scroll", handleScroll)

      return () => element.removeEventListener("scroll", handleScroll)
    }
    return
  }, [parentRef])

  const observerCallback = React.useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (hasMore) {
        setIntersecting(entry.isIntersecting)
      }
    },
    [hasMore],
  )

  const disconnect = React.useCallback(() => {
    if (observerRef && observerRef.current) {
      observerRef.current.disconnect()
    }
  }, [])

  const observe = React.useCallback(() => {
    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin,
      threshold,
    })
    if (targetRef && targetRef) {
      observerRef.current.observe(targetRef)
    }
  }, [observerCallback, rootMargin, targetRef, threshold])

  // useLayoutEffect runs synchronously after React has performed all DOM mutations
  React.useLayoutEffect(() => {
    observe()
    return () => {
      disconnect()
    }
  }, [observe, disconnect])

  return { items, intersecting, setTargetRef }
}

export default useVirtualIntersection
