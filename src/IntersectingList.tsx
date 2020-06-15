import React from "react"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"
import useIntersecting from "./useIntersecting"

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
    id: string
    label: string
  }>
  loadMore: () => void
  hasMore: boolean
}

const IntersectingList = ({ data, loadMore, hasMore }: Props) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const targetRef = React.useRef<HTMLDivElement>(null)
  const visible = useIntersecting(targetRef, 0.25)
  const classes = useStyles()

  React.useEffect(() => {
    if (visible && hasMore) {
      loadMore()
    }
  }, [hasMore, loadMore, visible])

  return (
    <Paper className={classes.container} ref={parentRef} id="parent-ref">
      <List>
        {data.map((item, index) => (
          <ListItem key={index} id={`row-${index}`} className={classes.row}>
            <strong>ID:</strong>&nbsp;{item.id} &nbsp;
            <strong>Descriptor:</strong>&nbsp;
            {item.label}
          </ListItem>
        ))}
        <div ref={targetRef} />
      </List>
      {/* {isFetching && "Fetching more list items..."} */}
    </Paper>
  )
}

export default IntersectingList
