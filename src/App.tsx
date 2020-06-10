import React from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import FixedRow from "./FixedRow"
import useInfiniteScroll from "./useInfiniteScroll"

const useStyles = makeStyles({
  layout: {
    width: "85%",
    margin: "auto",
    paddingTop: "100px",
  },
})

const App = () => {
  const fetchMore = () => {
    setTimeout(() => {
      setListItems((prevState) => [
        ...prevState,
        ...Array.from(Array(20).keys(), (n) => n + prevState.length + 1),
      ])
      // @ts-ignore FIX THIS!
      setIsFetching(false)
    }, 2000)
  }
  const [listItems, setListItems] = React.useState(
    Array.from(Array(30).keys(), (n) => n + 1),
  )
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMore)
  const classes = useStyles()

  return (
    <Grid container className={classes.layout}>
      <Grid item xs={12}>
        <FixedRow
          data={listItems}
          fetchMore={fetchMore}
          isFetching={isFetching}
        />
      </Grid>
    </Grid>
  )
}

export default App
