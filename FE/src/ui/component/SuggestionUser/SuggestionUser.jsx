import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER } from "./query";
import { SEND_REQUEST, SIGGESSION_OF_USER } from "./mutation";
// import { GET_USERS } from "./queries"; // Define your queries in a separate file

export default function UsersSuggestions() {
  const { data, loading, error, refetch } = useQuery(SIGGESSION_OF_USER);

  const users = data?.suggestionOfUser;

  const [sendFriendRequest] = useMutation(SEND_REQUEST);
  // console.log("🚀 ~ UsersSuggestions ~ data:", data);

  const [requests, setRequests] = useState({});

  const handleSendRequest = (userId) => {
    setRequests((prevRequests) => ({
      ...prevRequests,
      [userId]: true, // Set the request status for the specific user
    }));

    sendFriendRequest({ variables: { friendId: userId } });
  };

  useEffect(() => {
    refetch();
  }, [data]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading users</Typography>;

  return (
    <Box>
      <Typography variant="h6">User Suggestions</Typography>
      <List>
        {users?.map((user) => (
          <ListItem key={user._id}>
            <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSendRequest(user._id)}
              disabled={requests[user._id]} // Check the request status for this user
            >
              {!requests[user._id] ? "Request" : "Requested"}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
