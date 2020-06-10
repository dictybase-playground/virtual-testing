import React from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import FixedRow from "../src/FixedRow"

const useStyles = makeStyles({
  layout: {
    width: "85%",
    margin: "auto",
    paddingTop: "100px",
  },
})

const App = () => {
  const classes = useStyles()

  return (
    <Grid container className={classes.layout}>
      <Grid item xs={12}>
        <FixedRow />
      </Grid>
    </Grid>
  )
}

export default App
