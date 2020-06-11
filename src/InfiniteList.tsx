import React from "react"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"
import useInfiniteScroll from "./useInfiniteScroll"

const useStyles = makeStyles(() => ({
  container: {
    height: "300px",
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

const InfiniteList = ({ data, loadMore, hasMore }: Props) => {
  const parentRef = React.useRef<HTMLUListElement>(null)
  const [isFetching, setIsFetching] = useInfiniteScroll(
    loadMore,
    parentRef,
    hasMore,
  )
  const classes = useStyles()

  return (
    <Paper className={classes.container}>
      <List ref={parentRef} id="parent-ref">
        {data.map((item, index) => (
          <ListItem key={index} className={classes.row}>
            {item.label}
          </ListItem>
        ))}
      </List>
      {isFetching && "Fetching more list items..."}
    </Paper>
  )
}

export default InfiniteList
