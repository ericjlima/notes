const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../config/secret.json');

const con = mysql.createConnection(config);
con.connect();

// Get scores from the database
router.get('/', (req, res) => {
    con.query('SELECT * FROM scores ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(results);
    });
});

// Function to setup WebSocket server with the express app
const setupWebSocket = (server) => {
    const socketIo = require('socket.io');
    const io = socketIo(server);

    // Set up WebSocket
    io.on('connection', (socket) => {
        console.log('Client connected');

        // Send existing scores to the newly connected client
        con.query('SELECT * FROM scores ORDER BY id DESC', (err, results) => {
            if (err) return socket.emit('error', 'Server error');
            // Emit scores to client
            socket.emit('scoreboard', results);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports =  router ;
