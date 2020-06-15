import React from "react"
import { Switch, Route } from "react-router-dom"
import IntersectingListContainer from "./IntersectingListContainer"
import InfiniteListContainer from "./InfiniteListContainer"

const Routes = () => {
  return (
    <Switch>
      <Route path="/use-intersecting">
        <IntersectingListContainer />
      </Route>
      <Route path="/use-infinite-scroll">
        <InfiniteListContainer />
      </Route>
    </Switch>
  )
}

export default Routes
