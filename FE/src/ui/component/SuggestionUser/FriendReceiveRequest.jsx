import React, { useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "./query";
import { ACCEPT_FRIEND_REQUEST } from "./mutation";
// import { GET_FRIEND_REQUESTS, ACCEPT_FRIEND_REQUEST } from "./queries"; // Define your queries in a separate file
// import { GET_ME } from "./query";

export default function GetFriendRequests() {
  //   const { data, loading, error } = useQuery(GET_FRIEND_REQUESTS);
  // const { data, loading, error } = useQuery(GET_USER_REQUEST);
  // console.log("🚀 ~ FriendRequests ~ data:", data);
  //   const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST);

  const { data, loading, error, refetch } = useQuery(GET_ME);
  const [acceptFriendRequest, { refetch: receveReqRefetch }] = useMutation(
    ACCEPT_FRIEND_REQUEST
  );
  console.log("🚀 ~ GetFriendRequests ~ data:", data);

  useEffect(() => {
    refetch();
  }, [data]);

  const handleAcceptRequest = (requestId) => {
    acceptFriendRequest({
      variables: {
        friendId: requestId,
      },
    })
      .then((res) => {
        console.log(
          "🚀 ~ .then ~ res:",
          res?.data?.acceptFriendRequest?.message
        );

        refetch();
        receveReqRefetch();
      })
      .catch((error) => {
        console.log("🚀 ~ acceptFriendRequest ~ error:", error);
      });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading friend requests</Typography>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      marginTop={"20px"}
    >
      <Typography variant="h6">Friend Requests</Typography>
      {data?.GetMe?.friendRequests.length > 0 ? (
        <List>
          {data?.GetMe?.friendRequests?.map((request) => (
            <ListItem key={request._id}>
              <ListItemText
                primary={`${request.firstName} ${request.lastName}`}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAcceptRequest(request._id)}
              >
                Accept
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography paddingTop={"20px"}>No friend requests</Typography>
      )}
    </Box>
  );
}
