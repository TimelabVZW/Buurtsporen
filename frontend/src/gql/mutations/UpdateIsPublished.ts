import { gql } from "@apollo/client";

const mutationUpdateIsPublished = gql`
mutation updateIsPublished($id: Int!) {
  updateIsPublished(
            id: $id
    ) {
      id
      isHighlighted
      isPublished
    }
  }`;

export default mutationUpdateIsPublished;