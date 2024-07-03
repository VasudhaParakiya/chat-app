import { gql } from "apollo-server-express";

const user = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    gender: Gender
    receiver: [String]
    sender: [String]
    friendRequests: [User]
    friends: [User]
    groups: [Group]
    # hobby: [String!]
    # profile: String
    # status: String
    # friends: [ID]
    # blockedUsers: [ID]
    createdAt: String
    updatedAt: String
  }

  enum Gender {
    male
    female
  }

  type userResult {
    token: String
  }

  input createUserInput {
    firstName: String
    lastName: String
    email: String
    password: String
    gender: Gender
    # receiver:
    # hobby: [String!]
    # profile: String
  }

  type Response {
    message: String
  }

  input loginUserInput {
    email: String
    password: String
  }

  type FriendsAndGroupsResult {
    _id: ID
    firstName: String
    lastName: String
    friendsList: [User]
    groupsList: [Group]
  }

  type Friend {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  # Define the Group type
  type GroupOfFriend {
    _id: ID!
    groupName: String!
  }

  # Define a union type to represent either a Friend or a Group
  union FriendOrGroup = Friend | GroupOfFriend

  type TwoFA {
    secret: String
    qrCode: String
  }

  type Query {
    getUser: [User]
    GetMe: User
    GetMyFriends: User
    suggestionOfUser: [User]
    getListOfFriendAndGroup: [Message]
    searchFriend(searchText: String): [FriendOrGroup]
  }

  type Mutation {
    createUser(input: createUserInput): User
    loginUser(input: loginUserInput): userResult
    sendFriendRequest(friendId: String!): Response
    acceptFriendRequest(friendId: String!): Response
    deleteFriend(friendId: String!): Response
    generateTwoFASecret(email: String): TwoFA
    verifyTwoFA(email: String, secretKey: String, code: String): userResult
  }
`;

export default user;
