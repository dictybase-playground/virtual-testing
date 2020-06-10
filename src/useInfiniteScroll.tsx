import React from "react"

const useInfiniteScroll = (callback: () => any) => {
  const [isFetching, setIsFetching] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetching
      )
        return
      setIsFetching(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isFetching])

  React.useEffect(() => {
    if (!isFetching) return
    callback()
    console.log("called back")
    // setIsFetching(false)
  }, [callback, isFetching])

  return [isFetching, setIsFetching]
}

export default useInfiniteScroll
