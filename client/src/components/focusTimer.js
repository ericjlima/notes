import React, { useState, useEffect, useRef } from 'react';

const FocusTimer = () => {
    const [minutes, setMinutes] = useState(0);
      const [seconds, setSeconds] = useState(5);
        const [timeLeft, setTimeLeft] = useState(0);
          const [isRunning, setIsRunning] = useState(false);
            const [repeat, setRepeat] = useState(false);
              const [lastTime, setLastTime] = useState({ minutes: 0, seconds: 5 });
                const [musicUrl, setMusicUrl] = useState(localStorage.getItem('musicURL') || 'https://www.youtube.com/watch?v=5qap5aO4i9A');
                  const [showMusicInput, setShowMusicInput] = useState(false);
                    const [audioFile, setAudioFile] = useState(null);
                      const intervalRef = useRef(null);
                        const audioRef = useRef(null);

                          useEffect(() => {
                                if (isRunning && timeLeft > 0) {
                                        intervalRef.current = setInterval(() => {
                                                  setTimeLeft(prev => prev - 1);
                                                        }, 1000);
                                            } else if (timeLeft === 0 && isRunning) {
                                                    clearInterval(intervalRef.current);
                                                          if (audioRef.current) audioRef.current.play();
                                                                if (repeat) {
                                                                          setTimeout(startTimer, 1000);
                                                                                } else {
                                                                                          setIsRunning(false);
                                                                                                }
                                                                    }
                                    return () => clearInterval(intervalRef.current);
                                      }, [timeLeft, isRunning]);

                            const startTimer = () => {
                                  const total = parseInt(minutes) * 60 + parseInt(seconds);
                                      setTimeLeft(total);
                                          setLastTime({ minutes, seconds });
                                              setIsRunning(true);
                                                };

                              const stopTimer = () => {
                                    clearInterval(intervalRef.current);
                                        setIsRunning(false);
                                            setTimeLeft(0);
                                              };

                                const resetToTenMinutes = () => {
                                      setMinutes(10);
                                          setSeconds(0);
                                              setTimeLeft(600);
                                                };

                                  const resetToLastTime = () => {
                                        setMinutes(lastTime.minutes);
                                            setSeconds(lastTime.seconds);
                                                setTimeLeft(lastTime.minutes * 60 + lastTime.seconds);
                                                  };

                                    const toggleRepeat = () => {
                                          setRepeat(prev => !prev);
                                            };

                                      const toggleMusicInput = () => {
                                            setShowMusicInput(prev => !prev);
                                              };

                                        const handleMusicChange = (url) => {
                                              setMusicUrl(url);
                                                  localStorage.setItem('musicURL', url);
                                                    };

                                          const handleAudioFile = (e) => {
                                                const file = e.target.files[0];
                                                    if (file) {
                                                            const url = URL.createObjectURL(file);
                                                                  setAudioFile(url);
                                                                      }
                                                      };

                                            const formatTime = (total) => {
                                                  const m = String(Math.floor(total / 60)).padStart(2, '0');
                                                      const s = String(total % 60).padStart(2, '0');
                                                          return `${m}:${s}`;
                                                            };

                                              return (
                                                      <div style={{ backgroundColor: '#1a1a2e', color: '#eaeaea', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif' }}>
                                                            <h1>Focus Timer</h1>

                                                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                                                          <div>
                                                                                    <label>Minutes: <input type="number" value={minutes} min="0" onChange={e => setMinutes(e.target.value)} /></label>
                                                                                              <label style={{ marginLeft: '1rem' }}>Seconds: <input type="number" value={seconds} min="0" max="59" onChange={e => setSeconds(e.target.value)} /></label>
                                                                                                      </div>

                                                                                                              <input type="file" accept="audio/*" onChange={handleAudioFile} style={{ color: '#eaeaea' }} />

                                                                                                                      <div>
                                                                                                                                <button onClick={startTimer}>Start</button>
                                                                                                                                          <button onClick={stopTimer} style={{ marginLeft: '0.5rem' }}>Stop</button>
                                                                                                                                                    <button onClick={resetToTenMinutes} style={{ marginLeft: '0.5rem' }}>Reset to 10:00</button>
                                                                                                                                                              <button onClick={resetToLastTime} style={{ marginLeft: '0.5rem' }}>Reset to last</button>
                                                                                                                                                                        <button onClick={toggleRepeat} style={{ marginLeft: '0.5rem' }}>Repeat: {repeat ? 'On' : 'Off'}</button>
                                                                                                                                                                                </div>
                                                                                                                                                                                      </div>

                                                                                                                                                                                            <div style={{ fontSize: '3rem', margin: '1rem 0' }}>{formatTime(timeLeft)}</div>

                                                                                                                                                                                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                                                                                                                                          <a href={musicUrl} target="_blank" rel="noreferrer" style={{ color: '#00f0ff', textDecoration: 'none' }}>Concentration Music</a>
                                                                                                                                                                                                                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#16213e', borderRadius: '5px', padding: '0.25rem' }}>
                                                                                                                                                                                                                            <button onClick={toggleMusicInput} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}>✏️</button>
                                                                                                                                                                                                                                      <input
                                                                                                                                                                                                                                                  type="text"
                                                                                                                                                                                                                                                              value={musicUrl}
                                                          onChange={e => handleMusicChange(e.target.value)}
                                                                      onBlur={() => setShowMusicInput(false)}
                                                                                  placeholder="Enter music URL"
                                                                                                style={{
                                                                                                                width: showMusicInput ? '300px' : '0',
                                                                                                                              opacity: showMusicInput ? 1 : 0,
                                                                                                                                            transition: 'width 0.3s ease, opacity 0.3s ease',
                                                                                                                                                          overflow: 'hidden',
                                                                                                                                                                        padding: '0.5rem',
                                                                                                                                                                                      fontSize: '1rem'
                                                                                                                                                                                                    }}
                                                                                            />
                                                                                                      </div>
                                                                                                            </div>

                                                                                                                  <audio ref={audioRef} src={audioFile}></audio>
                                                                                                                      </div>
                                                                                                                        );
};

export default FocusTimer;
