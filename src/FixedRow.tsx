import React from "react"
import { useVirtual } from "react-virtual"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"
import useInfiniteScroll from "./useInfiniteScroll"

const useStyles = makeStyles(() => ({
  container: {
    height: "200px",
    overflow: "auto",
  },
  row: {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    "&:hover": {
      backgroundColor: "#eeeeee",
      boxShadow:
        "inset 1px 0 0 #dadce0,inset -1px 0 0 #dadce0,0 1px 2px 0 rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15)",
      zIndex: 1,
    },
  },
}))

const FixedRow = () => {
  const [data, setData] = React.useState(
    Array.from(Array(30).keys(), (n) => n + 1),
  )
  const fetchMore = React.useCallback(() => {
    setTimeout(() => {
      setData((prevState) => [
        ...prevState,
        ...Array.from(Array(20).keys(), (n) => n + prevState.length + 1),
      ])
    }, 2000)
  }, [])
  const parentRef = React.useRef<HTMLDivElement>(null)
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMore, parentRef)
  const rowVirtualizer = useVirtual({
    size: 100,
    parentRef,
    estimateSize: React.useCallback(() => 35, []),
    overscan: 5,
  })
  const classes = useStyles()

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.virtualItems].reverse()
    if (!lastItem) {
      return
    }
    if (
      lastItem.index === data.length - 1 &&
      // canFetchMore &&
      !isFetching
    ) {
      fetchMore()
      // @ts-ignore
      setIsFetching(false)
    }
  }, [
    data.length,
    fetchMore,
    isFetching,
    rowVirtualizer.virtualItems,
    setIsFetching,
  ])

  return (
    <Paper ref={parentRef} id="parent-ref" className={classes.container}>
      <List>
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const isLoaderRow = virtualRow.index > data.length - 1
          const index = virtualRow.index
          const item = data[index]

          return (
            <ListItem
              key={index}
              className={classes.row}
              id={`row-${index}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                // size is 35px in this example
                height: `${virtualRow.size}px`,
                // repositions element vertically on 2D plane
                // virtualRow.start is incremented by 35 each time here
                transform: `translateY(${virtualRow.start}px)`,
              }}>
              {isLoaderRow ? "Loading more..." : `Row ${item}`}
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}

export default FixedRow
