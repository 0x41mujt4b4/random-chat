import React, { useEffect, useState } from "react";
// import ChatBar from "./ChatBar";
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
      <div className="flex h-svh items-center justify-center">
        <div id="wifi-loader">
          <svg viewBox="0 0 86 86" className="circle-outer">
            <circle r="40" cy="43" cx="43" className="back"></circle>
            <circle r="40" cy="43" cx="43" className="front"></circle>
            <circle r="40" cy="43" cx="43" className="new"></circle>
          </svg>
          <svg viewBox="0 0 60 60" className="circle-middle">
            <circle r="27" cy="30" cx="30" className="back"></circle>
            <circle r="27" cy="30" cx="30" className="front"></circle>
          </svg>
          <svg viewBox="0 0 34 34" className="circle-inner">
            <circle r="14" cy="17" cx="17" className="back"></circle>
            <circle r="14" cy="17" cx="17" className="front"></circle>
          </svg>
          <div data-text="Looking for someone..." className="text"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-svh">
      {/* <ChatBar socket={socket} /> */}
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
