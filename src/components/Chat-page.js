import React, { useEffect, useState } from "react";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
// import ChatFooter from './ChatFooter';
const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [partnerTypingStatus, setPartnerTypingStatus] = useState("");
  // const [paired, setPaired] = useState(false);
  const [loading, setLoading] = useState(true);
  // const lastMessageRef = useRef(null);
  useEffect(() => {
    const handleMessageResponse = (data) => setMessages((prevMessages) => [...prevMessages, data]);
    socket.on("messageResponse", handleMessageResponse);

    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket]);

  useEffect(() => {
    const handleTypingResponse = (data) => setPartnerTypingStatus(data);
    const handlePaired = (data) => {
      alert(data.message);
      // setPaired(true);
      setLoading(false);
    };

    socket.on("typingResponse", handleTypingResponse);
    socket.on('paired', handlePaired);

    return () => {
      socket.off("typingResponse", handleTypingResponse);
      socket.off("paired", handlePaired);
    };
  }, [socket]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
          <p>Waiting for another user to connect...</p>
          {/* You can replace the following with a spinner if you'd like */}
          <div className="spinner" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-svh">
      <ChatBar socket={socket} />
      <ChatBody
        messages={messages}
        setMessages={setMessages}
        socket={socket}
        partnerTypingStatus={partnerTypingStatus}
        setPartnerTypingStatus={setPartnerTypingStatus}
      />
    </div>
  );
};
export default ChatPage;
