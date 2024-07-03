import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../pages/login/Login";
import SignUp from "../../pages/login/SignUp";
import Home from "../../pages/home/Home";
import Welcome from "../Welcome/Welcome";
import Chat from "../Chat/Chat";
import { useAuth } from "../context/authContext";
import UsersSuggestions from "../SuggestionUser/SuggestionUser";
import GetFriendRequests from "../SuggestionUser/FriendReceiveRequest";

const ProtectedRoute = ({ element }) => {
  console.log("🚀 ~ ProtectedRoute ~ element:", element);
  const { isAuthenticated } = useAuth();
  console.log(
    "🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~🚀 ~ ProtectedRoute ~ isAuthenticated:",
    isAuthenticated
  );

  if (isAuthenticated) return element;
};

export default function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<ProtectedRoute element={<Home />} />}>
          <Route index element={<Welcome />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path=":id/:name" element={<Chat />} />
          <Route path="suggestion" element={<UsersSuggestions />} />
          <Route path="receiveRequest" element={<GetFriendRequests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
