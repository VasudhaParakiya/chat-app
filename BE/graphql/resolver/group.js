import { combineResolvers } from "graphql-resolvers";
import Group from "../../modal/group";
import User from "../../modal/user";
import { isAuthenticated } from "../../middleware/authentication";
import Message from "../../modal/message";
import mongoose from "mongoose";

const getAllGroup = async () => {
  try {
    const groups = await Group.find({}).populate([
      { path: "admin", select: "_id firstName lastName email" },
      { path: "members", select: "_id firstName lastName email" },
      {
        path: "messages",
        select: "_id text",
        populate: [
          { path: "senderId", select: "_id firstName lastName email" },
          { path: "receiverId", select: "_id firstName lastName email" },
        ],
      },
    ]);
    if (!groups) return new Error("group not found");
    return groups;
  } catch (error) {
    console.log("🚀 ~ getAllGroup ~ error:", error);
  }
};

const createGroup = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    // console.log("🚀 ~ args:", args);
    try {
      const { groupName, memberIds } = args.input;
      //   const data = [user.id, ...memberIds];
      //   console.log("🚀 ~ data:", data);

      const group = new Group({
        groupName: groupName,
        admin: user.id,

        members: [user.id, ...memberIds],
      });

      await group.save();
      // console.log("🚀 ~ group:", group);
      group.populate([
        { path: "admin", select: "firstName lastName email" },
        { path: "members", select: "firstName lastName email" },
      ]);

      // Add the group to each member's list of groups
      await User.updateMany(
        { _id: { $in: [user.id, ...memberIds] } },
        { $push: { groups: group._id } }
      );

      return group;
    } catch (error) {
      console.log("🚀 ~ error:", error.message);
    }
  }
);

const sendMessageToGroup = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    try {
      const { text, groupId } = args.input;
      let message = new Message({ text, senderId: user.id, groupId });

      // message=await User.populate(message,{path:"group"})
      await message.save();
      message = await message.populate([
        { path: "senderId", select: "firstName lastName email" },
        { path: "receiverId", select: "firstName lastName email" },
        {
          path: "groupId",
          select: "_id groupName",
          populate: [{ path: "members", select: "firstName lastname email" }],
        },
      ]);

      const group = await Group.findById(groupId);
      if (!group) return new Error("group not found");
      group.messages.push(message._id);
      await group.save();

      return message;
    } catch (error) {
      console.log("🚀 ~ sendMessageToGroup ~ error:", error);
    }
  }
);

const renameGroup = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    try {
      //   console.log("🚀 ~ args:", args);
      const { _id, groupName } = args;

      const updatedGroupName = await Group.findByIdAndUpdate(
        { _id, admin: user.id },
        { groupName },
        {
          new: true,
        }
      ).populate({ path: "admin", select: "firstName lastname email" });
      if (!updatedGroupName)
        return new Error(
          "Group name could not be updated. Make sure you are the admin of the group."
        );
      return updatedGroupName;
    } catch (error) {
      console.log("🚀 ~ renameGroup ~ error:", error);
    }
  }
);

const addUserintoGroup = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    try {
      console.log("🚀 ~ args:", args);
      const { groupId, userIds } = args.input;

      const updatedGroup = await Group.findByIdAndUpdate(
        { _id: groupId },
        { $addToSet: { members: { $each: userIds } } },
        { new: true }
      ).populate([
        { path: "admin", select: "firstName lastname email" },
        { path: "members", select: "firstName lastname email" },
      ]);
      //   console.log("🚀 ~ updatedGroup:", updatedGroup);
      if (!updatedGroup) return new Error("member not added in to group");
      return updatedGroup;
    } catch (error) {
      console.log("🚀 ~ addUserintoGroup ~ error:", error);
    }
  }
);

const removeUserintoGroup = combineResolvers(
  isAuthenticated,
  async (_, { groupId, userId }, { user }) => {
    try {
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true }
      ).populate([
        { path: "admin", select: "firstName lastname email" },
        { path: "members", select: "firstName lastname email" },
      ]);
      //   console.log("🚀 ~ updatedGroup:", updatedGroup);
      if (!updatedGroup) return new Error("member not remove in to group");
      return updatedGroup;
    } catch (error) {
      console.log("🚀 ~ removeUserintoGroup ~ error:", error);
    }
  }
);

const getSingleGroup = combineResolvers(
  isAuthenticated,
  async (_, { groupId }, { user }) => {
    try {
      const group = await Group.findOne({
        _id: groupId,
        admin: user.id,
      }).populate([
        { path: "admin", select: "_id firstName lastName email" },
        { path: "members", select: "_id firstName lastName email" },
      ]);
      if (!group) return new Error("group not found");
      return group;
    } catch (error) {
      console.log("🚀 ~ getSingleGroup ~ error:", error);
    }
  }
);

const getGroupByMessage = combineResolvers(
  isAuthenticated,
  async (_, { groupId }, { user }) => {
    try {
      const group = await Group.findOne({
        _id: groupId,
        admin: user.id,
      }).populate([
        { path: "admin", select: "_id firstName lastName email" },
        {
          path: "messages",
          select: "_id text",
          populate: [
            { path: "senderId", select: "_id firstName lastName email" },
            { path: "receiverId", select: "_id firstName lastName email" },
          ],
        },
        ,
      ]);
      if (!group) return new Error("group not found");
      return group;
    } catch (error) {
      console.log("🚀 ~ getGroupByMessage ~ error:", error);
    }
  }
);

const removeGroup = combineResolvers(
  isAuthenticated,
  async (_, { groupId }, { user }) => {
    try {
      const deletedGroup = await Group.findByIdAndDelete({
        _id: groupId,
        admin: user.id,
      });

      if (!deletedGroup) return new Error("group is not deleted");

      // If the group was found and deleted, remove associated messages
      if (deletedGroup) {
        await Message.deleteMany({ groupId });

        await User.updateMany(
          { groups: groupId },
          { $pull: { groups: groupId } },
          { new: true }
        );
      }

      return { message: "group is remove and accoding all message is remove" };
    } catch (error) {
      console.log("🚀 ~ removeGroup ~ error:", error);
    }
  }
);

const group = {
  Query: {
    getAllGroup,
    getSingleGroup,
    getGroupByMessage,
  },
  Mutation: {
    createGroup,
    sendMessageToGroup,
    renameGroup,
    addUserintoGroup,
    removeUserintoGroup,
    removeGroup,
  },
};

export default group;
