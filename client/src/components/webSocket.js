import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const WebSocketComponent = () => {
  const [room, setRoom] = useState('');

  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', data => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  }

  const handleSendMessage = () => {
    socket.emit('send_message', {message, room});
  };

  return (
    <div>
      <h2>Messageboard</h2>
      <input
        placeholder="Room Number..."
        onChange={e => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <input
        type="text"
        placeholder="Enter message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Submit Message</button>

      <h3>Messages:</h3>
      {messageReceived}
      <ul>
        {messages.map((messageObj, index) => (
          <li key={index}>{messageObj.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;

