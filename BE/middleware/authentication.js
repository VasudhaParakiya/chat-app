import { skip } from "graphql-resolvers";

export const isAuthenticated = async (_, args, { user }) => {
  try {
    if (!user) {
      return new Error("Not authenticated");
    }
    skip;
  } catch (error) {
    console.error(error);
    return new Error("Not authenticated");
  }
};
