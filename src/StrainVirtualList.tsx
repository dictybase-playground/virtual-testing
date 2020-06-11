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

type Props = {
  data: Array<{
    label: string
  }>
  loadMore: () => void
  hasMore: boolean
}

const StrainVirtualList = ({ data, loadMore, hasMore }: Props) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const [isFetching] = useInfiniteScroll(loadMore, parentRef)
  const rowVirtualizer = useVirtual({
    size: hasMore ? data.length + 1 : data.length,
    parentRef,
    estimateSize: React.useCallback(() => 50, []),
    overscan: 5,
  })
  const classes = useStyles()

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.virtualItems].reverse()
    if (!lastItem) {
      return
    }
    if (lastItem.index === data.length - 1 && hasMore && !isFetching) {
      loadMore()
    }
  }, [data.length, hasMore, isFetching, loadMore, rowVirtualizer.virtualItems])

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
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}>
              {isLoaderRow
                ? hasMore
                  ? "Loading more..."
                  : "Nothing more to load"
                : `${item.label}`}
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}

export default StrainVirtualList
