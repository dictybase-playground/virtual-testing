import React from "react"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"
import useVirtualList from "./useVirtualList"

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
}

const VirtualList = ({ data }: Props) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowData = useVirtualList({
    ref: parentRef,
    rowHeight: 35,
    numItems: data.length,
    windowHeight: 310,
  })
  const classes = useStyles()
  const innerHeight = data.length * 35

  return (
    <Paper ref={parentRef} className={classes.container}>
      <List style={{ position: "relative", height: `${innerHeight}px` }}>
        {rowData.items.map((item: any, index: number) => {
          const strain = data[item.index]
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
      </List>
    </Paper>
  )
}

export default VirtualList
