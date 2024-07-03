import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";

import { Box, Divider, Stack, TextField } from "@mui/material";

import UserCard from "../UserCard/UserCard";
import { LIST_FRIEND_GROUP, REMOVE_FRIEND, SEARCH_FRIEND } from "./query";
import SidebarHeader from "./SidebarHeader";

export default function SideBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: listOfFriendAndGroup } = useQuery(LIST_FRIEND_GROUP);
  // console.log("🚀 ~ SideBar ~ listOfFriendAndGroup:", listOfFriendAndGroup);

  const mylist = listOfFriendAndGroup?.getListOfFriendAndGroup;
  // console.log("🚀 ~ SideBar ~ mylist:", mylist);

  // const newArray = mylist
  //   ?.map((item) => {
  //     if (item.groupId) {
  //       return item.groupId.groupName;
  //     } else if (item.receiverId) {
  //       const { firstName, lastName } = item.receiverId;
  //       return `${firstName} ${lastName}`;
  //     } else if (item.senderId) {
  //       const { firstName, lastName } = item.senderId;
  //       return `${firstName} ${lastName}`;
  //     }
  //   })
  //   .filter(Boolean);

  // console.log("🚀 ~ SideBar ~ newArray:", newArray);

  // const fglist=mylist?.groupId?mylist.groupId.
  // groupName:""

  // const list = listOfFriendAndGroup?.friendsList;
  // console.log("🚀 ~ SideBar ~ list:", list);

  const { data, error, loading, refetch } = useQuery(SEARCH_FRIEND, {
    variables: {
      searchText: searchQuery,
    },
  });

  const [removeFriend] = useMutation(REMOVE_FRIEND);

  const users = data?.searchFriend;
  // console.log("🚀 ~ SideBar ~ users:", users);

  const friendOrGroup = users?.map((item) => {
    if (item.__typename === "GroupOfFriend") {
      // return item.groupName; // Return group name directly
      const { groupName, _id } = item;
      return { groupName, _id };
    } else if (item.__typename === "Friend") {
      const { firstName, lastName, _id } = item;
      return { _id, firstName, lastName };
    }
  });
  // console.log("🚀 ~ friendOrGroup ~ friendOrGroup=========:", friendOrGroup);

  return (
    <Box backgroundColor="#EBEEF0" height={"100vh"} padding={"10px"}>
      <SidebarHeader />
      <Stack>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            marginY: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "white",
            },
          }}
        />
      </Stack>

      <Divider />
      <Stack>
        {friendOrGroup?.map((item, i) => (
          <UserCard
            // user={{ groupName: item }} // Pass groupName directly for groups
            key={i}
            {...item}
            removeFriend={removeFriend}
            refetch={refetch}
          />
        ))}
      </Stack>
    </Box>
  );
}
