import React from "react"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"
import useVirtualIntersection from "./useVirtualIntersection"

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
  totalItems: number
}

const InfiniteVirtualList = ({
  data,
  loadMore,
  hasMore,
  totalItems,
}: Props) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const {
    items,
    intersecting,
    setTargetRef,
    setIntersecting,
  } = useVirtualIntersection({
    parentRef,
    viewportHeight: 310,
    rowHeight: 35,
    overscan: 2,
    numItems: data.length,
    hasMore: true,
  })
  const classes = useStyles()
  // total height of the list itself
  const innerHeight = data.length * 35

  React.useEffect(() => {
    if (intersecting && hasMore) {
      loadMore()
      setIntersecting(false)
    }
  }, [hasMore, intersecting, loadMore, setIntersecting])

  const listItems = items.map((item: any) => {
    const strain = data[item.index]
    const lastRow = totalItems - 1 === item.index
    if (lastRow) {
      return (
        <ListItem
          // @ts-ignore
          ref={setTargetRef}
          key={item.index}
          id={`row-${item.index}`}
          data-testid={`row-${item.index}`}
          className={classes.row}
          style={item.style}>
          Loading more items...
        </ListItem>
      )
    }
    return (
      <ListItem
        key={item.index}
        id={`row-${item.index}`}
        data-testid={`row-${item.index}`}
        className={classes.row}
        style={item.style}>
        <strong>ID:</strong>&nbsp;{strain.id} &nbsp;
        <strong>Descriptor:</strong>&nbsp;
        {strain.label}
      </ListItem>
    )
  })

  return (
    <Paper ref={parentRef} className={classes.container}>
      <List style={{ position: "relative", height: `${innerHeight}px` }}>
        {listItems}
      </List>
    </Paper>
  )
}

export default InfiniteVirtualList
