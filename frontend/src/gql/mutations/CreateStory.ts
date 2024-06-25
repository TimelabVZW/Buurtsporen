import { gql } from "@apollo/client";

const mutationCreateStory = gql`
mutation createStory($title: String!, $slug: String!) {
    createStory(
        createStoryInput: {
            title: $title
            slug: $slug
        }
    ) {
      id
      title
      slug
    }
  }`;

export default mutationCreateStory;