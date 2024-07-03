import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "../../middleware/authentication";
import Message from "../../modal/message";
import User from "../../modal/user";

const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const EVENTS_MESSAGE_CREATE = "EVENTS_MESSAGE_CREATE";

const getMessage = async () => {
  try {
    const message = await Message.find({});
    return message;
  } catch (error) {
    console.log("🚀 ~ getMessage ~ error:", error);
  }
};

const messagesByUser = combineResolvers(
  isAuthenticated,
  async (_, { receiverId }, { user }) => {
    try {
      const messages = await Message.find({
        $or: [
          { receiverId, senderId: user.id },
          { receiverId: user.id, senderId: receiverId },
        ],
      })
        .populate([
          { path: "receiverId", select: "firstName" },
          { path: "senderId", select: "firstName" },
        ])
        .sort({ createdAt: 1 });

      // console.log("🚀 ~ messages:", messages);
      return messages;
    } catch (error) {
      console.log("🚀 ~ messagesByUser ~ error:", error);
      throw new Error("Error retrieving messages");
    }
  }
);

const createMessage = combineResolvers(
  isAuthenticated,
  async (_, { input }, { user }) => {
    // console.log("🚀 ~ input:", input);
    try {
      const currentUser = await User.findById({
        _id: user.id,
        isDeleted: false,
      });

      const receiver = await User.findById({
        _id: input.receiverId,
        isDeleted: false,
      });
      if (!receiver) throw new Error("Receiver not found");

      // const isFriend = currentUser.friends.find({ _id: receiver._id });
      const isFriend = currentUser.friends.some((friend) =>
        friend.equals(receiver._id)
      );
      console.log("🚀 ~ isFriend:", isFriend);
      if (!isFriend) throw new Error("Not friends with the receiver");

      const newMessage = (
        await Message.create({ ...input, senderId: user.id })
      ).populate([
        { path: "receiverId", select: "firstName" },
        { path: "senderId", select: "firstName" },
      ]);
      //   console.log("🚀 ~ newMessage:", newMessage);

      if (!newMessage) return new Error("message not send");

      pubsub.publish(
        EVENTS_MESSAGE_CREATE,
        {
          messageAdded: { keyType: "INSERT", data: newMessage },
        }
        // console.log("calllllllllllllllllllllllllllll subscription", newMessage)
      );
      console.log("🚀 ~ newMessage:", newMessage);

      return newMessage;
    } catch (error) {
      console.log("🚀 ~ createMessage ~ error:", error);
    }
  }
);

const message = {
  Query: {
    getMessage,
    messagesByUser,
  },
  Mutation: {
    createMessage,
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(EVENTS_MESSAGE_CREATE),
    },
  },
};

export default message;
