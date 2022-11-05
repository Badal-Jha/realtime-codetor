import React from "react";
import Avatar, { ConfigProvider } from "react-avatar";
import "./user.css";
const User = ({ username }) => {
  return (
    <div className="user">
      <Avatar
        color={Avatar.getRandomColor("sitebase", [
          "green",
          "red",
          "white",
          "blue",
        ])}
        name={username}
        size={40}
        round="7px"
      />
      <div className="username">{username}</div>
    </div>
  );
};

export default User;
