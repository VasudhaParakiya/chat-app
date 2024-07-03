import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Message from "../Message/Message";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  MESSAGEBYUSER,
  SENDMESSAGE,
  SUBSCRIPTION_SEND_MESSAGE,
} from "./mutation";
import SendIcon from "@mui/icons-material/Send";

export default function Chat() {
  const { id, name } = useParams();
  console.log("🚀 ~ Chat ~ id:", id);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const { data, loading, error, refetch } = useQuery(MESSAGEBYUSER, {
    variables: {
      receiverId: id,
    },
    onCompleted(data) {
      setMessages(data.messagesByUser);
      scrollToBottom();
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const [sendMessage] = useMutation(SENDMESSAGE, {
    onCompleted: () => {
      scrollToBottom();
    },
    // onCompleted(data) {
    // setMessages((prevmsg) => [...prevmsg, data?.createMessage]);
    // scrollToBottom();
    // },
  });

  const { data: sub_sendMessage } = useSubscription(SUBSCRIPTION_SEND_MESSAGE, {
    onSubscriptionData: ({ subscriptionData }) => {
      // console.log(
      //   "🚀 ~ Chat ~====================== subscriptionData:",
      //   subscriptionData
      // );
      const newMessage = subscriptionData?.data?.messageAdded?.data;
      setMessages((prevmsg) => [...prevmsg, newMessage]);
      scrollToBottom();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage({
      variables: {
        input: {
          text,
          receiverId: id,
        },
      },
    });
    setText("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ background: "white", boxShadow: 0 }}>
        <Toolbar>
          <Avatar
            // src={`https://api.dicebear.com/9.x/<styleName>/svg`}
            src={`https://api.dicebear.com/9.x/<styleName>/svg`}
            sx={{ width: "32px", height: "32px", mr: 2 }}
          />
          <Typography variant="h6" color={"black"}>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        background="#f5f5f5"
        height={"80vh"}
        padding={"10px"}
        sx={{ overflowY: "auto" }}
      >
        {loading ? (
          <Typography variant="h6">Loading....</Typography>
        ) : (
          messages.map((msg) => {
            return (
              <Message
                key={msg?.createdAt}
                text={msg?.text}
                date={msg?.createdAt}
                direction={msg?.receiverId?._id == id ? "start" : "end"}
              />
            );
          })
        )}

        <div ref={messagesEndRef} />

        {/* <Message text="hi" date={"41561"} direction={"start"} /> */}
        {/* <Message text="hi" date={"41561"} direction={"end"} /> */}
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack direction="row" padding={"20px"}>
          <TextField
            placeholder="enter message"
            variant="standard"
            fullWidth
            multiline
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </Box>
  );
}
