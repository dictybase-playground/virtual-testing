import React from "react"

const useIntersecting = (
  ref: React.MutableRefObject<any>,
  threshold = 0,
  rootMargin = "0px",
) => {
  const [intersecting, setIntersecting] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      { rootMargin: rootMargin, threshold: threshold },
    )
    const target = ref.current

    if (ref) {
      observer.observe(target)
    }

    // Clean up callback
    return () => observer.unobserve(target)
  }, [ref, rootMargin, threshold])
  return intersecting
}

export default useIntersecting
