import React from "react"

type ConfigParams = {
  ref: React.MutableRefObject<any>
  rootMargin?: string
  threshold?: number
  loadMore: () => void
  hasMore: boolean
}

const useIntersecting = ({
  ref,
  rootMargin = "0px",
  threshold = 0.25,
  loadMore,
  hasMore,
}: ConfigParams) => {
  const [intersecting, setIntersecting] = React.useState(false)

  React.useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      setIntersecting(entries[0].isIntersecting)
      if (intersecting && hasMore) {
        loadMore()
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: rootMargin,
      threshold: threshold,
    })
    const target = ref.current

    if (ref) {
      observer.observe(target)
    }

    // Clean up callback
    return () => observer.unobserve(target)
  }, [hasMore, intersecting, loadMore, ref, rootMargin, threshold])
  return intersecting
}

export default useIntersecting
