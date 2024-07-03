import { combineResolvers } from "graphql-resolvers";
import User from "../../modal/user";
import { generateToken } from "../../utils/commanFunction";
import { isAuthenticated } from "../../middleware/authentication";
import mongoose from "mongoose";
import Message from "../../modal/message";
import Group from "../../modal/group";
import { sendEmail } from "../../utils/sendEmail";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const bcrypt = require("bcrypt");

const getUser = combineResolvers(isAuthenticated, async (_, args, { user }) => {
  // console.log("getUser");
  try {
    const currentUser = await User.findById(user.id).select("friends").lean();
    // console.log("🚀 ~ getUser ~ currentUser:", currentUser);

    // Collect friend IDs and add the current user's ID
    const excludeIds = currentUser.friends.concat(user.id);
    // console.log("🚀 ~ getUser ~ excludeIds:", excludeIds);

    const users = await User.find({
      _id: { $nin: excludeIds },
      isDeleted: false,
    }).select("firstName lastName email");
    // console.log("🚀 ~ getUser ~ users:", users);

    return users;
  } catch (error) {
    console.log("🚀 ~ getUser ~ error:", error.message);
    return new Error(error);
  }
});

const createUser = async (_, { input }) => {
  // console.log("🚀 ~ createUser ~ input:", input);

  try {
    let { email } = input;
    // console.log("🚀 ~ createUser ~ email:", email);

    const existUser = await User.findOne({ email, isDeleted: false });
    // console.log("🚀 ~ createUser ~ existUser:", existUser);

    if (existUser) return new Error("This email is already exits. ");

    const newUser = new User(input);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    newUser.save();

    // console.log("🚀 ~ createUserInput ~ newUser:", newUser);
    if (!newUser) return new Error("user not creates");

    return newUser;
  } catch (error) {
    console.log("🚀 ~ createUserInput ~ error:", error.message);
    return new Error(error);
  }
};

const suggestionOfUser = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    try {
      const currentUser = await User.findById(user.id);
      // .select("friendRequests friends")
      // .lean();
      // console.log("🚀 ~ currentUser:", currentUser);

      // Extract IDs of friends and users who sent friend requests
      const friendIds = currentUser.friends.map((friend) => friend._id);
      // console.log("🚀 ~ friendIds:", friendIds);
      const requestSenderIds = currentUser.friendRequests.map(
        (request) => request._id
      );
      // console.log("🚀 ~ requestSenderIds:", requestSenderIds);

      const suggestedUsers = await User.find({
        _id: { $nin: [...friendIds, ...requestSenderIds, user.id] },
      })
        .select("firstName lastName email")
        .lean();
      // console.log("🚀 ~ suggestedUsers:", suggestedUsers);
      return suggestedUsers;
    } catch (error) {
      console.log("🚀 ~ suggestionOfUser ~ error:", error);
    }
  }
);

const sendFriendRequest = combineResolvers(
  isAuthenticated,
  async (_, { friendId }, { user }) => {
    try {
      const friend = await User.findOne({ _id: friendId, isDeleted: false });
      if (!friend) throw new Error("User not found");

      if (friend.friendRequests.includes(user.id)) {
        throw new Error("request already sent successfully");
      }

      const updatedFriend = await User.findByIdAndUpdate(
        { _id: friendId },
        { $push: { friendRequests: user.id } },
        { new: true } // Return the updated document
      );

      console.log("🚀 ~ friend:", updatedFriend?.friendRequests);

      // or
      // friend.friendRequests.push(user.id);
      // await friend.save();
      // console.log("🚀 ~ friend:", friend?.friendRequests);

      return { success: true, message: "Friend request sent" };
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }
);

const acceptFriendRequest = combineResolvers(
  isAuthenticated,
  async (_, { friendId }, { user }) => {
    try {
      const currentUser = await User.findById({
        _id: user.id,
        isDeleted: false,
      });
      if (!currentUser) throw new Error("User not found");

      const friend = await User.findById({ _id: friendId, isDeleted: false });
      if (!friend) throw new Error("Friend not found");

      // Check if the friend request exists in user's friendRequests
      if (!currentUser.friendRequests.includes(friendId)) {
        throw new Error("Friend request not found");
      }

      currentUser.friends.push({ _id: friendId });
      currentUser.friendRequests = currentUser.friendRequests.filter(
        (id) => id.toString() !== friendId
      );
      await currentUser.save();

      // Add user id to friend's friends list
      friend.friends.push({ _id: currentUser._id });
      await friend.save();
      // friend.friends.push(user.id);
      // await friend.save();
      // console.log("🚀 ~ user:", currentUser);

      return { message: "Friend request accepted" };
    } catch (error) {
      console.log("🚀 ~ acceptFriendRequest ~ error:", error.message);
      return new Error(error.message);
    }
  }
);

const GetMe = combineResolvers(isAuthenticated, async (_, args, { user }) => {
  console.log("🚀 ~ user:", user);
  try {
    const currentUser = await User.findById({ _id: user.id }).populate([
      {
        path: "friendRequests",
        select: "firstName lastName email",
      },
      {
        path: "friends",
        select: "firstName lastName email",
      },
    ]);

    // console.log("🚀 ~ currentUser:", currentUser);
    if (!currentUser) throw new Error("request not found");
    return currentUser;
  } catch (error) {
    console.log("🚀 ~ GetFriendRequests ~ error:", error);
  }
});

const deleteFriend = combineResolvers(
  isAuthenticated,
  async (_, { friendId }, { user }) => {
    // console.log("🚀 ~ friendId:", friendId);
    try {
      if (!mongoose.Types.ObjectId.isValid(friendId)) {
        throw new Error("Invalid friend ID");
      }

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { $pull: { friends: new mongoose.Types.ObjectId(friendId) } },
        { new: true }
      );
      // console.log("🚀 ~ updatedUser:", updatedUser.friends);

      // Remove current user from friend's friends list
      const updatedFriend = await User.findByIdAndUpdate(
        { _id: friendId },
        { $pull: { friends: new mongoose.Types.ObjectId(user.id) } },
        { new: true }
      );

      await Message.deleteMany({
        $or: [
          { senderId: user.id, receiverId: friendId },
          { senderId: friendId, receiverId: user.id },
        ],
      });

      return { message: "friend remove successfully" };
    } catch (error) {
      console.log("🚀 ~ deleteFriend ~ error:", error);
    }
  }
);

const searchFriend = combineResolvers(
  isAuthenticated,
  async (_, { searchText }, { user }) => {
    try {
      const regexSearch = searchText ? new RegExp(searchText, "i") : /.*/;

      const currentUser = await User.findById(user.id).populate([
        {
          path: "friends",
          select: "firstName lastName email",
        },
        {
          path: "groups",
          select: "groupName",
        },
      ]);

      // Combining friends and groups into one array
      const allFriendOrGroup = [...currentUser.friends, ...currentUser.groups];
      // console.log(
      //   "🚀 ~ allFriendOrGroup:",
      //   JSON.stringify(allFriendOrGroup, null, 2)
      // );

      // Filtering based on the search text
      const searchResults = allFriendOrGroup.filter((item) => {
        if (item.firstName || item.lastName) {
          return (
            regexSearch.test(item.firstName) || regexSearch.test(item.lastName)
          );
        } else if (item.groupName) {
          return regexSearch.test(item.groupName);
        }
        return false;
      });

      if (!searchResults.length) return new Error("No search results found");

      return searchResults;
    } catch (error) {
      console.log("🚀 ~ searchFriend ~ error:", error);
      throw new Error("An error occurred while searching friends and groups");
    }
  }
);

const GetMyFriends = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    try {
      const friends = await User.findById({ _id: user.id }).populate({
        path: "friends",
        select: "firstName lastName email",
      });

      if (!friends) throw new Error("no friend found");

      return friends;
    } catch (error) {
      console.log("🚀 ~ GetMyFriends ~ error:", error);
    }
  }
);

// currentUser: [ new ObjectId('6673e76cbcb8c40b1c82a33b') ]

const loginUser = async (_, { input }) => {
  // console.log("🚀 ~ loginUser ~ input:", input);
  try {
    let { email, password } = input;
    const existUser = await User.findOne({ email, isDeleted: false });
    // console.log("🚀 ~ loginUser ~ existUser:", existUser);

    if (!existUser) return new Error("user dosen't exists with this email");

    const matchPassword = await existUser.isPasswordCorrect(password);
    if (!matchPassword) new Error("password invalid");

    // const payload = {
    //   email: existUser.email,
    //   id: existUser._id,
    // };

    const token = await generateToken(existUser);
    // console.log("🚀 ~ loginUser ~ token:", token);
    return { token };
  } catch (error) {
    console.log("🚀 ~ loginUser ~ error:", error);
  }
};

// const userWithFriendsAndGroups = await User.findById(user.id)
//   .populate([
//     { path: "friends", select: "firstName lastName" },
//     {
//       path: "groups",
//       populate: [
//         { path: "admin", select: "firstName lastName" },
//         { path: "members", select: "firstName lastName" },
//       ],
//     },
//   ])

//   .exec();
// const list = [...currentUser.friends, ...currentUser.groups];
// console.log("🚀 ~ list:", list);
// return list;

const getListOfFriendAndGroup = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    console.log("🚀 ~ user:", user.id);
    try {
      // const data = await User.findById({ _id: user.id });
      // console.log("🚀 ~ data:", data)

      const currentUser = await User.findById(user.id)
        .populate([
          { path: "friends", select: "firstName lastName email" },
          { path: "groups", select: "_id groupName" },
        ])
        .exec();
      // console.log("🚀 ~========= userWithFriendsAndGroups:", currentUser);

      // Fetch messages from friends
      const friendMessages = await Message.find({
        $or: [
          { senderId: { $in: currentUser.friends } },
          { receiverId: { $in: currentUser.friends } },
        ],
      }).sort({ createdAt: 1 });
      // console.log("🚀 ~ friendMessages:", friendMessages);

      // // Fetch messages from groups
      const groupMessages = await Message.find({
        groupId: { $in: currentUser.groups },
      }).sort({ createdAt: -1 });
      // console.log("🚀 ~ groupMessages:", groupMessages);

      // Combine friend messages and group messages
      const allMessages = [...friendMessages, ...groupMessages];

      // Sort messages by creation date
      allMessages.sort((a, b) => b.createdAt - a.createdAt);
      // console.log("🚀 ~ allMessages:", allMessages);

      const populatedMessages = await Promise.all(
        allMessages.map(async (message) => {
          await message.populate([
            { path: "receiverId", select: "firstName lastName" },
            // { path: "senderId", select: "firstName lastName" },
            { path: "groupId", select: "_id groupName" },
          ]);
          return message;
        })
      );
      // console.log("🚀 ~ data:", populatedMessages);
      return populatedMessages;

      // Find groups where the user is a member but not the admin
      // const memberGroups = await Group.find({
      //   members: user.id,
      // });
      // console.log("🚀 ~ memberGroups:", memberGroups);
      // console.log("🚀 ~ userWithFriendsAndGroups:", userWithFriendsAndGroups);
      // return userWithFriendsAndGroups;

      // const userAggregatedData = await User.aggregate([
      //   {
      //     $match: {
      //       _id: new mongoose.Types.ObjectId(user.id),
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "friends",
      //       foreignField: "_id",
      //       as: "friendsList",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "groups",
      //       let: { userId: "$_id" },
      //       pipeline: [
      //         {
      //           $match: {
      //             $expr: {
      //               $or: [
      //                 { $eq: ["$admin", "$$userId"] },
      //                 { $in: ["$$userId", "$members"] },
      //               ],
      //             },
      //           },
      //         },
      //         {
      //           $project: {
      //             _id: 1,
      //             groupName: 1,
      //           },
      //         },
      //       ],
      //       as: "groupsList",
      //     },
      //   },

      //   {
      //     $project: {
      //       _id: 1,
      //       firstName: 1,
      //       lastName: 1,
      //       friendsList: {
      //         _id: 1,
      //         firstName: 1,
      //         lastName: 1,
      //         email: 1,
      //       },
      //       groupsList: 1,
      //     },
      //   },
      // ]);

      // console.log(
      //   "🚀 ~ user aggr:",
      //   JSON.stringify(userAggregatedData, null, 2)
      // );
      // return userAggregatedData;
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }
);

const generateTwoFASecret = async (_, { email }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) return new Error("Invalid user");

    const secret = speakeasy.generateSecret({
      name: email,
      length: 15,
    });
    // console.log("🚀 ~ generateTwoFASecret ~ secret:", secret);
    let qrCodeUrl = QRCode.toDataURL(secret.otpauth_url);
    // console.log("🚀 ~ generateTwoFASecret ~ qrCode:", qrCodeUrl);
    return { secret: secret.base32, qrCode: qrCodeUrl };
  } catch (error) {
    console.log("🚀 ~ sendOtpInEmail ~ error:", error);
  }
};

const verifyTwoFA = async (_, { email, secretKey, code }) => {
  try {
    let tokenValidates = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });
    console.log("🚀 ~ verifyOTP ~ tokenValidates:", tokenValidates);
    if (tokenValidates) {
      // Update the user's secretKey in the database
      const user = await User.findOneAndUpdate(
        { email },
        { $set: { "twoFA.secretKey": secretKey } },
        { new: true }
      );

      // Generate a token for the user
      const token = await generateToken(user);

      return { token };
    } else {
      throw new Error("Invalid code. Please try again.");
    }
  } catch (error) {
    console.log("🚀 ~ verifyOTP ~ error:", error.message);
  }
};

const user = {
  Query: {
    getUser,
    GetMe,
    GetMyFriends,
    suggestionOfUser,
    searchFriend,
    getListOfFriendAndGroup,
  },
  FriendOrGroup: {
    __resolveType(obj) {
      if (obj.firstName || obj.lastName) {
        return "Friend";
      }
      if (obj.groupName) {
        return "GroupOfFriend";
      }
      return null; // GraphQLError is thrown
    },
  },
  Mutation: {
    createUser,
    loginUser,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriend,
    generateTwoFASecret,
    verifyTwoFA,
  },
};

export default user;
