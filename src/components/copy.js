import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const ChatBody = ({ messages, socket, typingStatus }) => {
  const [message, setMessage] = useState("");
  const handleTyping = () => {
    console.log("messages: ", localStorage.getItem("userName"));
    let typing = false;
    let timeout = undefined;
    if (!typingStatus) {
      socket.emit("typing", {user: localStorage.getItem("userName")});
      timeout = setTimeout(() => {
        socket.emit("typing", "");
        }, 5000);
    }
    else
    {
      clearTimeout(timeout);
      setTimeout(() => {
      socket.emit("typing", "");
      }, 5000);
    }
  }
  const handleSendMessage = (e) => {
    // e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      socket.emit("message", {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  };

  return (
    <div style={{height: "100%" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={typingStatus && <TypingIndicator content="Stranger is typing" />}>
            {messages.map((message) =>
              message.name === localStorage.getItem("userName") ? (
                <Message
                  id={message.id}
                  model={{
                    message: message.text,
                    sentTime: "just now",
                    sender: message.name,
                  }}
                />
              ) : (
                <Message
                  id={message.id}
                  model={{
                    direction: "incoming",
                    message: message.text,
                    sentTime: "just now",
                    sender: message.name,
                  }}
                />
              )
            )}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={message}
            onChange={(value) => {
              setMessage(value)
              // handleTyping()
            }}
            /*OnKeyDown function*/
            onKeyDown={handleTyping}
            onSend={handleSendMessage}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
export default ChatBody;
