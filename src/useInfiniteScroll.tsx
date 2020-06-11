import React from "react"

const useInfiniteScroll = (
  callback: () => any,
  parentRef: React.MutableRefObject<any>,
  hasMore: boolean,
) => {
  const [isFetching, setIsFetching] = React.useState(false)

  React.useEffect(() => {
    const container = parentRef.current
    console.log(container)
    const handleScroll = () => {
      if (
        container.scrollHeight - container.scrollTop ===
          container.clientHeight ||
        isFetching
      ) {
        console.log("equals")
        return
      }
      setIsFetching(true)
    }
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [isFetching, parentRef])

  React.useEffect(() => {
    if (!isFetching && !hasMore) return
    // callback()
    console.log("called back")
    setIsFetching(false)
  }, [callback, hasMore, isFetching])

  return [isFetching, setIsFetching] as const
}

export default useInfiniteScroll
