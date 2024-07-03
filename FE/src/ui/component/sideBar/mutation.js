import { gql } from "@apollo/client";

export const CREATE_GROUP = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      _id
      groupName
      admin {
        _id
        firstName
        lastName
      }
      members {
        _id
        firstName
        lastName
      }
      messages {
        _id
        senderId {
          _id
          firstName
          lastName
        }
        receiverId {
          _id
          firstName
          lastName
        }
        groupId {
          _id
          groupName
          members {
            _id
            firstName
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;
