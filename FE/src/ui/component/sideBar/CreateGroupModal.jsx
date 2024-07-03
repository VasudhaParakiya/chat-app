import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { CREATE_GROUP } from "./mutation";

export default function CreateGroupModal({
  friends,
  isModalOpen,
  setIsModalOpen,
}) {
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});

  const [createGroup] = useMutation(CREATE_GROUP);

  const handleFriendSelection = (event) => {
    const { name, checked, value } = event.target;

    setSelectedFriends((prevSelected) => {
      if (checked) {
        // If checked, add the friend to selectedFriends
        return [...prevSelected, { [name]: value }];
      } else {
        // If unchecked, filter out the friend from selectedFriends
        return prevSelected.filter((friend) => friend[name] !== value);
      }
    });
  };

  //   console.log("🚀 ~ selectedFriends:", selectedFriends);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleGroupCreation = () => {
    console.log("Group Name:", groupName);

    const groupMembers = selectedFriends.map(
      (friend) => friend[Object.keys(friend)[0]]
    );
    // console.log("Group Members:", groupMembers);

    createGroup({
      variables: {
        input: {
          groupName,
          memberIds: groupMembers,
        },
      },
    })
      .then((res) => {
        console.log("🚀 ~ handleGroupCreation ~ res:", res);
      })
      .catch((error) => {
        console.log("🚀 ~ handleGroupCreation ~ error:", error);
      });
    setSelectedFriends([]);
    // Close modal after creation
    setIsModalOpen(false);
  };
  return (
    <Dialog open={isModalOpen} onClose={handleModalClose}>
      <DialogTitle>Create Group</DialogTitle>
      <DialogContent>
        <TextField
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          size="small"
          margin="dense"
        />

        <TextField
          label="Selected Friends"
          value={selectedFriends?.map((friend) => Object.keys(friend)[0])}
          fullWidth
          size="small"
          margin="dense"
          disabled
        />

        {friends?.map((friend) => {
          // console.log("🚀 ~ {friends?.map ~ friend:", friend);
          return (
            <FormControlLabel
              key={friend._id}
              control={
                <Checkbox
                  id={friend._id}
                  name={friend.firstName}
                  value={friend._id}
                  onChange={(e) => handleFriendSelection(e)}
                />
                // <Checkbox name={friend} onChange={handleFriendSelection} />
              }
              label={friend.firstName}
            />
          );
        })}
        {/* }) */}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleModalClose}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleGroupCreation}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
