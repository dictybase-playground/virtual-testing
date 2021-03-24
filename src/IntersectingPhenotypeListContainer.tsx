import React from "react"
import { useQuery } from "@apollo/react-hooks"
import IntersectingList from "./IntersectingList"
import { GET_STRAIN_LIST_WITH_PHENOTYPE } from "./query"

const IntersectingListContainer = () => {
  const [hasMore, setHasMore] = React.useState(true)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [prevCursor, setPrevCursor] = React.useState(null)
  const { loading, error, data, fetchMore } = useQuery(
    GET_STRAIN_LIST_WITH_PHENOTYPE,
    {
      variables: {
        cursor: 0,
        limit: 10,
        phenotype: "abolished protein phosphorylation",
      },
    },
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const loadMoreItems = () => {
    const newCursor = data.listStrainsWithAnnotation.nextCursor
    if (newCursor === prevCursor) {
      return
    }
    setPrevCursor(newCursor)
    setIsLoadingMore(true)
    fetchMore({
      query: GET_STRAIN_LIST_WITH_PHENOTYPE,
      variables: {
        cursor: newCursor,
        limit: 10,
        phenotype: "abolished protein phosphorylation",
      },
      updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
        setIsLoadingMore(false)
        const previousEntry = previousResult.listStrainsWithAnnotation
        const previousStrains = previousEntry.strains
        const newStrains = fetchMoreResult.listStrainsWithAnnotation.strains
        const newCursor = fetchMoreResult.listStrainsWithAnnotation.nextCursor
        const allStrains = [...previousStrains, ...newStrains]

        if (newCursor === 0) {
          setHasMore(false)
        }

        return {
          listStrainsWithAnnotation: {
            nextCursor: newCursor,
            strains: allStrains,
            __typename: previousEntry.__typename,
          },
        }
      },
    })
  }

  return (
    <IntersectingList
      data={data.listStrainsWithAnnotation.strains}
      loadMore={loadMoreItems}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
    />
  )
}

export default IntersectingListContainer
