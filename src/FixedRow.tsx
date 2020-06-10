import React from "react"
import { useVirtual } from "react-virtual"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { makeStyles } from "@material-ui/core/styles"

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
  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtual({
    size: 10000,
    parentRef,
    estimateSize: React.useCallback(() => 35, []),
    overscan: 5,
  })
  const classes = useStyles(rowVirtualizer.totalSize)
  console.log(parentRef)
  return (
    <Paper ref={parentRef} id="parent-ref" className={classes.container}>
      <List>
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          return (
            <ListItem
              key={virtualRow.index}
              className={classes.row}
              id={`row-${virtualRow.index}`}
              tabIndex={-1} // necessary to use keyDown on <li> element
              onKeyDown={(event) => {
                console.log(parentRef)
                parentRef.current &&
                  parentRef.current.scrollTo({
                    left: 0,
                    top: 500,
                  })
              }}
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
              Row {virtualRow.index}
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}

export default FixedRow
