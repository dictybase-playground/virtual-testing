import React from "react"

type ConfigParams = {
  ref: React.MutableRefObject<any>
  rootMargin?: string
  threshold?: number
}

const useIntersecting = ({
  ref,
  rootMargin = "0px",
  threshold = 0.25,
}: ConfigParams) => {
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
