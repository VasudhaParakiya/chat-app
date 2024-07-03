import React, { useState } from "react";

import { useAuth } from "../context/authContext";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../SuggestionUser/query";
import CreateGroupModal from "./CreateGroupModal";

export default function SidebarHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [friends, setFriendes] = useState([]);

  const { data, loading, error } = useQuery(GET_ME, {
    onCompleted: () => {
      setFriendes(data?.GetMe?.friends);
    },
  });
  console.log("🚀 ~ SidebarHeader ~ friends:", data);

  const [menuItem, setMenuItem] = useState(null);
  const [isOpenMenu, setIsOpenmenu] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleClick = (event) => {
    setIsOpenmenu(true);
    setMenuItem(event.currentTarget);
  };

  const handleClose = () => {
    setIsOpenmenu(false);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const handleCreateGroup = () => {
    handleClose();
    setIsModalOpen(true);
  };

  // const handleModalClose = () => {
  //   setIsModalOpen(false);
  // };

  // const handleGroupCreation = () => {
  //   console.log("Group Name:", groupName);
  //   // console.log("Selected Friends:", friends);
  //   // Close modal after creation
  //   // setIsModalOpen(false);
  // };

  return (
    <>
      <Stack
        direction="row"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">Chat</Typography>
        <Button
          id="basic-button"
          onClick={handleClick}
          sx={{ cursor: "pointer" }}
        >
          <MoreVertIcon style={{ cursor: "pointer", color: "black" }} />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={menuItem}
          open={isOpenMenu}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
        </Menu>
      </Stack>
      <CreateGroupModal
        friends={friends}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
