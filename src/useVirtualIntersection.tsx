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
  /** React ref used to access DOM node */
  targetRef: React.MutableRefObject<any>
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
  targetRef,
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

  React.useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      if (hasMore) {
        setIntersecting(entries[0].isIntersecting)
      }
    }
    let element,
      target: any = null
    if (parentRef && parentRef.current) {
      element = parentRef.current
    }
    const observer = new IntersectionObserver(callback, {
      root: element,
      rootMargin: rootMargin,
      threshold: threshold,
    })
    if (targetRef && targetRef.current) {
      target = targetRef.current
      observer.observe(target)
    }

    return () => observer.unobserve(target)
  }, [hasMore, intersecting, parentRef, rootMargin, targetRef, threshold])

  return { items, intersecting }
}

export default useVirtualIntersection
