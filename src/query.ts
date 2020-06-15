import gql from "graphql-tag"

const GET_STRAIN_LIST = gql`
  query StrainList($cursor: Int!, $limit: Int!, $filter: String!) {
    listStrains(input: { cursor: $cursor, limit: $limit, filter: $filter }) {
      nextCursor
      strains {
        id
        label
      }
    }
  }
`

export default GET_STRAIN_LIST
