import { gql } from "@apollo/client";

const mutationUpdateIsHighlighted = gql`
mutation updateIsHighlighted($id: Int!) {
  updateIsHighlighted(
            id: $id
    ) {
      id
      isHighlighted
      isPublished
    }
  }`;

export default mutationUpdateIsHighlighted;