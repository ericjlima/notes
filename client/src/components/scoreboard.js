// Scoreboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Scoreboard = () => {
    const [scores, setScores] = useState([]);
    const [newScore, setNewScore] = useState('');

    useEffect(() => {
        const socket = io('http://localhost:4000'); // Your server URL

        socket.on('scoreUpdate', (scoreData) => {
            setScores((prevScores) => [...prevScores, scoreData]);
        });

        // Fetch initial scores
        axios.get('http://localhost:4000/scores')
            .then(response => setScores(response.data))
            .catch(error => console.error('Error fetching scores:', error));

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleAddScore = () => {
        const scoreData = { score: newScore };
        axios.post('http://localhost:4000/scores', scoreData)
            .then(response => {
                setNewScore('');
            })
            .catch(error => console.error('Error adding score:', error));
    };

    return (
        <div>
            <h1>Scoreboard</h1>
            <input
                type="text"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                placeholder="Enter score"
            />
            <button onClick={handleAddScore}>Add Score</button>
            <ul>
                {scores.map((score, index) => (
                    <li key={index}>{score.score}</li>
                ))}
            </ul>
        </div>
    );
};

export default Scoreboard;
