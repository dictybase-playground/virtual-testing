import React from "react"
import { useQuery } from "@apollo/client"
import VirtualList from "./VirtualList"
import { GET_STRAIN_LIST } from "./query"

const VirtualListContainer = () => {
  const { loading, error, data } = useQuery(GET_STRAIN_LIST, {
    variables: {
      cursor: 0,
      limit: 2000,
      filter: "",
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return <VirtualList data={data.listStrains.strains} />
}

export default VirtualListContainer
