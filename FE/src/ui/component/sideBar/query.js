import { gql } from "@apollo/client";

// export const GET_USER = gql`
//   query GetUser {
//     getUser {
//       _id
//       firstName
//       lastName
//       email
//     }
//   }
// `;

export const REMOVE_FRIEND = gql`
  mutation DeleteFriend($friendId: String!) {
    deleteFriend(friendId: $friendId) {
      message
    }
  }
`;

export const SEARCH_FRIEND = gql`
 query SearchFriend($searchText: String) {
  searchFriend(searchText: $searchText) {
    ... on Friend {
      _id
      firstName
      lastName
      email
    }
    ... on GroupOfFriend {
      _id
      groupName
    }
  }
}
`;

export const LIST_FRIEND_GROUP = gql`
  query GetListOfFriendAndGroup {
    getListOfFriendAndGroup {
      _id
      text
      createdAt
      groupId {
        _id
        groupName
      }
      receiverId {
        _id
        firstName
        lastName
      }
      senderId {
        _id
        firstName
        lastName
      }
    }
  }
`;
