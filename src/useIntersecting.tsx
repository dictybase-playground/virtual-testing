import React from "react"

// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

type ConfigParams = {
  /** React ref used to access DOM node */
  ref: React.MutableRefObject<any>
  /** Margin around the root */
  rootMargin?: string
  /** Indicates the percentage of the target's visibility the observer's
   * callback should be executed */
  threshold?: number
  /** Indicates whether there are more items to fetch */
  hasMore: boolean
  /** React ref for element that is used as viewport for checking visibility of target */
  root?: React.MutableRefObject<any>
}

const useIntersecting = ({
  ref,
  rootMargin = "0px",
  threshold = 0.25,
  hasMore,
  root,
}: ConfigParams) => {
  const [intersecting, setIntersecting] = React.useState(false)

  React.useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      if (hasMore) {
        setIntersecting(entries[0].isIntersecting)
      }
    }
    let element = null
    if (root && root.current) {
      element = root.current
    }
    const observer = new IntersectionObserver(callback, {
      root: element,
      rootMargin: rootMargin,
      threshold: threshold,
    })
    const target = ref.current
    observer.observe(target)

    return () => observer.unobserve(target)
  }, [hasMore, intersecting, ref, root, rootMargin, threshold])

  return intersecting
}

export default useIntersecting
