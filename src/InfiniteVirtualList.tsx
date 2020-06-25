import React from "react"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"
import useVirtualList from "./useVirtualList"
import useIntersecting from "./useIntersecting"

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

const InfiniteVirtualList = ({
  data,
  loadMore,
  hasMore,
  isLoadingMore,
}: Props) => {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const targetRef = React.useRef<any>(null)
  const rowData = useVirtualList({
    ref: rootRef,
    rowHeight: 35,
    numItems: data.length,
    viewportHeight: 310,
    // overscan: 2,
  })
  const visible = useIntersecting({
    targetRef,
    hasMore,
    rootRef,
  })
  const classes = useStyles()
  // total height of the list itself
  const innerHeight = data.length * 35

  React.useEffect(() => {
    if (visible && hasMore) {
      loadMore()
    }
  }, [hasMore, loadMore, visible])

  return (
    <Paper ref={rootRef} className={classes.container}>
      <List style={{ position: "relative", height: `${innerHeight}px` }}>
        {rowData.items.map((item: any) => {
          const strain = data[item.index]
          if (data.length - 1 === item.index) {
            console.log(visible)
            return (
              <ListItem
                ref={targetRef}
                key={item.index}
                id={`row-${item.index}`}
                className={classes.row}
                style={item.style}>
                abcd
              </ListItem>
            )
          }
          return (
            <ListItem
              key={item.index}
              id={`row-${item.index}`}
              className={classes.row}
              style={item.style}>
              <strong>ID:</strong>&nbsp;{strain.id} &nbsp;
              <strong>Descriptor:</strong>&nbsp;
              {strain.label}
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

export default InfiniteVirtualList
