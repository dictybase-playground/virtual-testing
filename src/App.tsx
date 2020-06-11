import React from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
// import FixedRow from "./FixedRow"
import GraphQLContainer from "./GraphQLContainer"

const client = new ApolloClient({
  link: setContext((request, { headers }) => {
    return {
      headers: {
        ...headers,
        "X-GraphQL-Method": "Query",
      },
    }
  }).concat(
    createHttpLink({
      uri: "https://ericgraphql.dictybase.dev/graphql",
      credentials: "include",
    }),
  ),
  cache: new InMemoryCache(),
})

const useStyles = makeStyles({
  layout: {
    width: "50%",
    margin: "auto",
    paddingTop: "80px",
  },
})

const App = () => {
  const classes = useStyles()

  return (
    <ApolloProvider client={client}>
      <Grid container className={classes.layout}>
        <Grid item xs={12}>
          <GraphQLContainer />
        </Grid>
        {/* <Grid item xs={12}>
          <FixedRow />
        </Grid> */}
      </Grid>
    </ApolloProvider>
  )
}

export default App
