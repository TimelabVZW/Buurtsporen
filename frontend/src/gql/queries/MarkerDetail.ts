import { gql } from "@apollo/client";

const GET_MARKER_DETAIL = gql`
    query GetMarkerById ( $id : Int! ) {
        marker(id: $id) {
            id
            name
            description
            type
            createdAt
            coordinates {
              longitude
              latitude
            }
            timestamps {
              id
              author
              description
              fileName
              createdAt
              url
            }
        }
    }`
;

export default GET_MARKER_DETAIL;