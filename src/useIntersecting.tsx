import React from "react"

// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

type ConfigParams = {
  /** React ref used to access DOM node */
  targetRef: React.MutableRefObject<any>
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

const useIntersecting = ({
  targetRef,
  rootRef,
  rootMargin = "0px",
  threshold = 0.25,
  hasMore,
}: ConfigParams) => {
  const [intersecting, setIntersecting] = React.useState(false)

  React.useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      if (hasMore) {
        setIntersecting(entries[0].isIntersecting)
      }
    }
    let element,
      target: any = null
    if (rootRef && rootRef.current) {
      element = rootRef.current
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
  }, [hasMore, intersecting, rootMargin, rootRef, targetRef, threshold])

  return intersecting
}

export default useIntersecting
