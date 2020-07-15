import React from "react"

// reference for why we are using callback for ref:
// https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780

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
  const prevTargetRef = React.useRef<any>(targetRef)
  const observerRef = React.useRef<any>(null)

  // calculate the start and end indexes of list items to render to DOM
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

  // add scroll event listener to parent ref
  React.useEffect(() => {
    if (parentRef && parentRef.current) {
      const element = parentRef.current
      element.addEventListener("scroll", handleScroll)

      return () => element.removeEventListener("scroll", handleScroll)
    }
    return
  }, [parentRef])

  // update prevTargetRef if targetRef value changes
  React.useEffect(() => {
    prevTargetRef.current = targetRef
  }, [targetRef])

  // set up callback fn that updates isIntersecting state if there is
  // more data to fetch
  const observerCallback = React.useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (hasMore) {
        setIntersecting(entry.isIntersecting)
      }
    },
    [hasMore],
  )

  // callback fn that adds intersection observer to observer ref
  // and observes the target ref if it exists
  const observe = React.useCallback(() => {
    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin,
      threshold,
    })

    if (targetRef) {
      observerRef.current.observe(targetRef)
    }
  }, [observerCallback, rootMargin, targetRef, threshold])

  // standard callback fn to disconnect from observer
  const disconnect = React.useCallback(() => {
    if (observerRef && observerRef.current) {
      observerRef.current.disconnect()
    }
  }, [])

  // set up the intersection observer
  React.useEffect(() => {
    // if the target ref matches the previous ref, set intersecting to false;
    // this prevents unwanted extra fetches
    if (targetRef === prevTargetRef.current) {
      setIntersecting(false)
    }
    observe()
    return () => {
      disconnect()
    }
  }, [observe, disconnect, targetRef])

  return { items, intersecting, setIntersecting, setTargetRef }
}

export default useVirtualIntersection
