import { gql } from "@apollo/client";

const mutationUpdateMarker = gql`
mutation updateMarker($id: Int!, $name: String, $description: String, $iconId: Int) {
    updateMarker(
        updateMarkerInput: {
            id: $id
            name: $name
            description: $description
            iconId: $iconId
        }
    ) {
      id
    }
  }`;

export default mutationUpdateMarker;