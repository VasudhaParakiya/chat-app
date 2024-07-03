import { gql } from "@apollo/client";

export const SEND_REQUEST = gql`
  mutation SendFriendRequest($friendId: String!) {
    sendFriendRequest(friendId: $friendId) {
      message
    }
  }
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($friendId: String!) {
    acceptFriendRequest(friendId: $friendId) {
      message
    }
  }
`;

export const SIGGESSION_OF_USER = gql`
  query SuggestionOfUser {
    suggestionOfUser {
      _id
      firstName
      lastName
      email
    }
  }
`;
