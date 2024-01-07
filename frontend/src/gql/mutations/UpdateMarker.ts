import { gql } from "@apollo/client";

const mutationUpdateMarker = gql`
mutation updateMarker($id: Int!, $name: String, $description: String) {
    updateMarker(
        updateMarkerInput: {
            id: $id
            name: $name
            description: $description
        }
    ) {
      id
    }
  }`;

export default mutationUpdateMarker;