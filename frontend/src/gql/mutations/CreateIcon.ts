import { gql } from "@apollo/client";

const mutationCreateIcon = gql`
mutation createIcon($name: String!, $fileName: String!, $url: String!) {
    createIcon(
        createIconInput: {
            name: $name
            fileName: $fileName
            url: $url
        }
    ) {
      id
      name
      fileName
      url
    }
  }`;

export default mutationCreateIcon;