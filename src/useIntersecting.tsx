import React from "react"

type ConfigParams = {
  ref: React.MutableRefObject<any>
  rootMargin?: string
  threshold?: number
  loadMore: () => void
  hasMore: boolean
  setIsLoadingMore: (arg0: boolean) => void
}

const useIntersecting = ({
  ref,
  rootMargin = "0px",
  threshold = 0.25,
  loadMore,
  hasMore,
  setIsLoadingMore,
}: ConfigParams) => {
  const [intersecting, setIntersecting] = React.useState(false)

  React.useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      setIntersecting(entries[0].isIntersecting)
      if (intersecting && hasMore) {
        setIsLoadingMore(true)
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
  }, [
    hasMore,
    intersecting,
    loadMore,
    ref,
    rootMargin,
    setIsLoadingMore,
    threshold,
  ])
  return intersecting
}

export default useIntersecting
