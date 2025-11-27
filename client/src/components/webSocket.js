import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

const connectURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://api.ericnote.us';

const socket = io.connect(connectURL);

const WebSocketComponent = () => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receive_message', data => {
      // Add the new message to the existing messages
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receive_message');
    };
  }, []);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
    }
  };

  const handleSendMessage = () => {
    socket.emit('send_message', {message, room});
    setMessage(''); // Clear the input after sending
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
      <ul>
        {messages.map((messageObj, index) => (
          <li key={index}>{messageObj.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
