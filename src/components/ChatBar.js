import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
    console.log("user ", users)
  }, [socket, users]);
  
  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="flex border-gray-200 justify-between p-4">
      <h2>RandomChat</h2>
      <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
      </button>
  </div>
  );
};
export default ChatBar;