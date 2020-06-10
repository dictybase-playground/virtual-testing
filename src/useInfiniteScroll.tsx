import React from "react"

const useInfiniteScroll = (
  callback: () => any,
  parentRef: React.MutableRefObject<any>,
) => {
  const [isFetching, setIsFetching] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + parentRef.current.scrollTop !==
          parentRef.current.offsetHeight ||
        isFetching
      )
        return
      setIsFetching(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isFetching, parentRef])

  React.useEffect(() => {
    if (!isFetching) return
    callback()
    console.log("called back")
    // setIsFetching(false)
  }, [callback, isFetching])

  return [isFetching, setIsFetching]
}

export default useInfiniteScroll
