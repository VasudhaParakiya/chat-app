import { gql } from "@apollo/client";

export const SENDMESSAGE = gql`
  mutation CreateMessage($input: createMessageInput!) {
    createMessage(input: $input) {
      _id
      text
      createdAt
      senderId {
        firstName
      }
      receiverId {
        firstName
      }
    }
  }
`;

export const MESSAGEBYUSER = gql`
  query MessagesByUser($receiverId: String) {
    messagesByUser(receiverId: $receiverId) {
      _id
      text
      receiverId {
        _id
        firstName
      }
      senderId {
        _id
        firstName
      }
      createdAt
    }
  }
`;

export const SUBSCRIPTION_SEND_MESSAGE = gql`
  subscription Subscription {
    messageAdded {
      keyType
      data {
        _id
        text
        receiverId {
          firstName
        }
        senderId {
          firstName
        }
        createdAt
      }
    }
  }
`;
