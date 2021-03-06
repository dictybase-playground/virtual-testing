import React from "react"
import { ApolloProvider } from "@apollo/client"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import { BrowserRouter, Link } from "react-router-dom"
import useApolloClient from "./useApolloClient"
import Routes from "./Routes"

const useStyles = makeStyles({
  layout: {
    width: "50%",
    margin: "auto",
    paddingTop: "80px",
  },
  link: {
    paddingRight: "15px",
  },
})

const App = () => {
  const client = useApolloClient()
  const classes = useStyles()

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Grid container className={classes.layout}>
          <Grid item xs={12}>
            <Link to="/use-intersecting" className={classes.link}>
              Use Intersecting
            </Link>
            <Link to="/use-infinite-scroll" className={classes.link}>
              Use Infinite Scroll
            </Link>
            <Link to="/use-intersecting-phenotype" className={classes.link}>
              Use Intersecting (Phenotype)
            </Link>
            <Link to="use-virtualization" className={classes.link}>
              Use Virtualization
            </Link>
            <Link to="use-both" className={classes.link}>
              Use Intersecting & Virtualization
            </Link>
            <Routes />
          </Grid>
        </Grid>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
