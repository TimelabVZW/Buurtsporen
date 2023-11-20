import { gql } from "@apollo/client";

const mutationUpdateIcon = gql`
mutation updateIcon($id: Int!, $name: String, $fileName: String, $url: String) {
    updateIcon(
        updateIconInput: {
            id: $id
            name: $name
            fileName: $fileName
            url: $url
        }
    ) {
      id
      name
      fileName
    }
  }`;

export default mutationUpdateIcon;