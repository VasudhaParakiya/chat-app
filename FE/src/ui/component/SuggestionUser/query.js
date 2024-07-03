import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      _id
      firstName
      lastName
      email
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    GetMe {
      _id
      firstName
      lastName
      email
      password
      gender
      receiver
      sender
      createdAt
      updatedAt
      friends {
        _id
        firstName
        lastName
        email
      }
      friendRequests {
        _id
        email
        firstName
        lastName
      }
    }
  }
`;
