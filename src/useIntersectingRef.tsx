import React from "react"

// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

type ConfigParams = {
  /** React ref for element that is used as viewport for checking visibility of target */
  rootRef?: React.MutableRefObject<any>
  /** Margin around the root */
  rootMargin?: string
  /** Indicates the percentage of the target's visibility the observer's
   * callback should be executed */
  threshold?: number
  /** Indicates whether there are more items to fetch */
  hasMore: boolean
}

const useIntersectingRef = ({
  rootMargin = "0px",
  threshold = 0.25,
  hasMore,
}: ConfigParams) => {
  const [targetRef, setTargetRef] = React.useState(null)
  const [intersecting, setIntersecting] = React.useState(false)
  const observerRef = React.useRef<any>(null)

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

  // maybe replace with useLayoutEffect?
  React.useEffect(() => {
    observe()
    return () => {
      disconnect()
    }
  }, [observe, disconnect])

  return [intersecting, setTargetRef]
}

export default useIntersectingRef
