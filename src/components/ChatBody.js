import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useState} from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  MessageSeparator
} from "@chatscope/chat-ui-kit-react";

const ChatBody = ({ messages, setMessages, socket, partnerTypingStatus, setPartnerTypingStatus }) => {
  const [message, setMessage] = useState('');

    socket.on('typingResponse', (data) => {
      if (data.socketID !== socket.id) {
        setPartnerTypingStatus(data.isTyping);
      }
    });

  const handleTyping = () => {
    socket.emit('typing', { isTyping: true, socketID: socket.id });
    setTimeout(() => {
      socket.emit('typing', { isTyping: false, socketID: socket.id });
    }, 3000); // Adjust the timeout as needed
  };

  const handleSubmit = (e) => {
    if (message.trim() && localStorage.getItem('userName')) {
      const messageResponse = {
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id
      };
      setMessages([...messages, messageResponse])
      socket.emit('message', messageResponse);
    }
    setMessage('');
  };

  return (
    <div className="flex-1">
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={partnerTypingStatus && <TypingIndicator content="Stranger is typing" />}>
          <MessageSeparator content="You are now talking with stranger!" />
          {messages.map((message) =>
              message.name === localStorage.getItem("userName") ? (
                <Message
                  id={message.id}
                  model={{
                    message: message.text,
                    sentTime: "just now",
                    sender: message.name,
                    position: "single"
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
                    position: "single"
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
            onSend={handleSubmit}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatBody;