import { gql } from "apollo-server-express";

const message = gql`
  scalar Date

  type Message {
    _id: ID
    text: String!
    receiverId: User
    senderId: User
    groupId: Group
    createdAt: Date
  }

  input createMessageInput {
    receiverId: String
    text: String
  }

  type Query {
    getMessage: [Message!]!
    messagesByUser(receiverId: String): [Message]!
  }

  type Mutation {
    createMessage(input: createMessageInput!): Message
    # messageByUser(receiverId:String):[Message]
  }

  type MessageAddedSubscription {
    keyType: String
    data: Message
  }

  type Subscription {
    messageAdded: MessageAddedSubscription
  }
`;

export default message;
