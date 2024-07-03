import { Box, Typography } from "@mui/material";
import React from "react";

export default function Message({ text, date, direction }) {
  const formatDate = (date) => {
    const messageDate = new Date(date);
    const now = new Date();

    const options = { hour: "2-digit", minute: "2-digit" };

    if (
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      // If the message date is today, return only the time without seconds
      return messageDate.toLocaleTimeString([], options);
    } else {
      // Otherwise, return the date and time without seconds
      return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString(
        [],
        options
      )}`;
    }
  };

  return (
    <Box display="flex" justifyContent={direction}>
      <Box>
        <Typography variant="subtitle2" background="white" padding={"5px"}>
          {text}
        </Typography>
        <Typography variant="caption">{formatDate(date)}</Typography>
      </Box>
    </Box>
  );
}
