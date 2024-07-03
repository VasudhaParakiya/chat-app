import { Stack, Typography } from "@mui/material";
import React from "react";

export default function Welcome() {
  return (
    <Stack
      display={"flex"}
      justifyContent={"center"}
      alignContent={"center"}
      flexGrow={1}
      height={"80vh"}
    >
      <Typography variant="h2">welcome to team</Typography>
    </Stack>
  );
}
