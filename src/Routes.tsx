import React from "react"
import { Switch, Route } from "react-router-dom"
import IntersectingListContainer from "./IntersectingListContainer"
import InfiniteListContainer from "./InfiniteListContainer"
import IntersectingPhenotypeListContainer from "./IntersectingPhenotypeListContainer"
import VirtualListContainer from "./VirtualListContainer"

const Routes = () => {
  return (
    <Switch>
      <Route path="/use-intersecting">
        <IntersectingListContainer />
      </Route>
      <Route path="/use-intersecting-phenotype">
        <IntersectingPhenotypeListContainer />
      </Route>
      <Route path="/use-infinite-scroll">
        <InfiniteListContainer />
      </Route>
      <Route path="/use-virtualization">
        <VirtualListContainer />
      </Route>
    </Switch>
  )
}

export default Routes
