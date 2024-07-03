import { Stack, Avatar, Typography, Box } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import DeleteIcon from "@mui/icons-material/Delete";
import { REMOVE_FRIEND } from "../sideBar/query";
import { useMutation } from "@apollo/client";

const generateAvatarUrl = (firstName, lastName) => {
  // const firstInitial = firstName.charAt(0).toUpperCase();
  // const lastInitial = lastName.charAt(0).toUpperCase();
  // return `https://avatars.dicebear.com/api/initials/${firstInitial}${lastInitial}.svg`;
  return `https://avatars.dicebear.com/api/initials/${firstName}${lastName}.svg`;
};

// export default function UserCard({
//   user: { _id, firstName, lastName, groupName },
//   removeFriend,
//   refetch,
// }) {
//   // console.log("🚀 ~ UserCard ~ _id:", _id);
//   const navigate = useNavigate();
//   // const [removeFriend] = useMutation(REMOVE_FRIEND);

//   const avatarUrl = generateAvatarUrl(firstName, lastName);

//   const handleRemoveFriend = (friendId) => {
//     removeFriend({
//       variables: {
//         friendId,
//       },
//     })
//       .then((res) => {
//         refetch();
//         navigate("/welcome");
//         console.log("🚀 ~ handleRemoveFriend ~ res:", res);
//       })
//       .catch((error) => {
//         console.log("🚀 ~ handleRemoveFriend ~ error:", error);
//       });
//   };

//   return (
//     <Box
//       display={"flex"}
//       justifyContent={"space-between"}
//       alignItems={"center"}
//     >
//       <Stack
//         direction={"row"}
//         spacing={2}
//         alignItems={"center"}
//         sx={{ py: 1 }}
//         className="usercard"
//         onClick={() => navigate(`/${_id}/${firstName} ${lastName}`)}
//       >
//         <Avatar src={avatarUrl} sx={{ width: "32px", height: "32px" }} />
//         <Typography variant="subtitle2">
//           {firstName} {lastName}
//         </Typography>
//       </Stack>
//       <DeleteIcon cursor="pointer" onClick={() => handleRemoveFriend(_id)} />
//     </Box>
//   );
// }

export default function UserCard({
  _id,
  firstName,
  lastName,
  groupName,
  removeFriend,
  refetch,
}) {
  // console.log("🚀 ~ UserCard ~ user==============:", user);
  // const { _id, firstName, lastName, groupName } = user;
  // console.log("🚀 ~ UserCard ~ _idxxxxxxxxxx:", _id);
  const avatarUrl = generateAvatarUrl(firstName, lastName);

  const navigate = useNavigate();

  const handleRemoveFriend = (friendId) => {
    removeFriend({
      variables: {
        friendId,
      },
    })
      .then((res) => {
        refetch();
        navigate("/welcome");
        console.log("🚀 ~ handleRemoveFriend ~ res:", res);
      })
      .catch((error) => {
        console.log("🚀 ~ handleRemoveFriend ~ error:", error);
      });
  };

  const handleNavigate = () => {
    const path = groupName ? `/${_id}/${groupName}` : `/${_id}/${firstName} ${lastName}`;
    navigate(path);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      onClick={handleNavigate}
      sx={{ py: 1 }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={avatarUrl} sx={{ width: "32px", height: "32px" }} />
        <Typography variant="subtitle2">
          {groupName ? groupName : `${firstName} ${lastName}`}
        </Typography>
      </Stack>
      <DeleteIcon cursor="pointer" onClick={() => handleRemoveFriend(_id)} />
    </Box>
  );
}
