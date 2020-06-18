import React from "react"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"
import useVirtualization from "./useVirtualization"

const useStyles = makeStyles(() => ({
  container: {
    height: "310px",
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
  loading: {
    color: "tomato",
  },
}))

type Props = {
  data: Array<{
    id: string
    label: string
  }>
  loadMore: () => void
  hasMore: boolean
  isLoadingMore: boolean
}

const VirtualList = ({ data, loadMore, hasMore, isLoadingMore }: Props) => {
  const rowData = useVirtualization({
    rowHeight: 25,
    numItems: data.length, // hasMore ? data.length + 1 : data.length
    windowHeight: 310,
  })
  const classes = useStyles()

  React.useEffect(() => {
    const [lastItem] = [...rowData.items].reverse()
    if (!lastItem) {
      return
    }
    if (lastItem.index === data.length - 1 && hasMore && !isLoadingMore) {
      loadMore()
    }
  }, [data.length, hasMore, isLoadingMore, loadMore, rowData.items])

  return (
    <Paper className={classes.container} onScroll={rowData.handleScroll}>
      <List
        style={{ position: "relative", height: `${rowData.innerHeight}px` }}>
        {rowData.items.map((item: any, index: number) => {
          const row = data[index]
          return (
            <ListItem
              key={index}
              id={`row-${index}`}
              className={classes.row}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `25px`,
                transform: `translateY(${item.start})`,
              }}>
              <strong>ID:</strong>&nbsp;{row.id} &nbsp;
              <strong>Descriptor:</strong>&nbsp;
              {row.label}
            </ListItem>
          )
        })}
        {isLoadingMore && (
          <ListItem className={classes.loading}>
            Fetching more list items...
          </ListItem>
        )}
      </List>
    </Paper>
  )
}

export default VirtualList
