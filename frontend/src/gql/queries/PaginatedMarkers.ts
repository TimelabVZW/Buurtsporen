import { gql } from "@apollo/client";

const GET_PAGINATED_MARKERS = gql`
  query SearchPaginatedMarkers($query: PaginateQuery!) {
    paginatedMarkers(query: $query) {
      id
      name
      createdAt
      author
      description
      type
      layer {
        id
        name
      }
      icon {
        id
      }
    }
    markers {
        id
    }
    icons {
      id
      name
      fileName
      url
    }
  }
`;

export const PaginateQuery = gql`
  input PaginateQuery {
    page: Int!
    limit: Int!
    sortBy: String!
    sortDirection: SortDirection!
    name: String
    description: String
    author: String
    type: String
    id: String
  }


  enum SortDirection {
    ASC
    DESC
  }
`;

export default GET_PAGINATED_MARKERS;