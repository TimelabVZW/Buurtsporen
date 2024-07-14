import { gql } from "@apollo/client";

const mutationRemoveStory = gql`
mutation removeStory($id: Int!) {
    removeStory(
        id: $id
    ) {
        __typename
    }
  }`;

export default mutationRemoveStory;