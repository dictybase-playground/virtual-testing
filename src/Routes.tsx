import React from "react"
import { Switch, Route } from "react-router-dom"
import GraphQLContainer from "./GraphQLContainer"

const Routes = () => {
  return (
    <Switch>
      <Route path="/:type">
        <GraphQLContainer />
      </Route>
    </Switch>
  )
}

export default Routes
