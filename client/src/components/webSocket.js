import React, { useEffect, useRef, useState } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create WebSocket connection
    socketRef.current = new WebSocket('wss://echo.websocket.org');

    // Connection opened
    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    // Listen for messages
    socketRef.current.onmessage = (event) => {
      setMessages(prevMessages => [...prevMessages, event.data]);
    };

    // Connection closed
    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Cleanup on unmount
    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (message) {
      socketRef.current.send(message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>WebSocket Example</h2>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      
      <h3>Received Messages:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
