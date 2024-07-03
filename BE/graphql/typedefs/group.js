import { gql } from "apollo-server-express";

const group = gql`
  type Group {
    _id: ID
    groupName: String
    admin: User
    members: [User]
    messages: [Message]
    createdAt: String
    updatedAt: String
  }

  input CreateGroupInput {
    groupName: String
    memberIds: [String]
  }

  input addUserintoGroup {
    groupId: String
    userIds: [String]
  }

  input sendMessageToGroupInput {
    text: String
    groupId: String
  }

  type Query {
    getAllGroup: [Group]
    getSingleGroup(groupId: String): Group
    getGroupByMessage(groupId: String): Group
  }

  type Mutation {
    createGroup(input: CreateGroupInput!): Group
    sendMessageToGroup(input: sendMessageToGroupInput): Message
    addUserintoGroup(input: addUserintoGroup!): Group
    removeUserintoGroup(groupId: String, userId: String): Group
    renameGroup(_id: String, groupName: String): Group
    removeGroup(groupId: String):Response
  }
`;

export default group;
