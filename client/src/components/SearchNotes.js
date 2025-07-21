/* global AbortController */
import React, { useState, useEffect } from 'react';
import { firstPathSegment } from '../utils/urlHelper';

const decodeMessage = msg => {
  try {
    return decodeURIComponent(msg);
  } catch (e) {
    return msg;
  }
};

const SearchNotes = props => {
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userOnly, setUserOnly] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNotes = async () => {
      if (query.trim() === '') {
        setNotes([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${props.baseURL}/api/search?query=${encodeURIComponent(query)}&userOnly=${userOnly}&firstPathSegment=${firstPathSegment()}`
        );
        const data = await response.json();
        setNotes(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    return () => controller.abort();
  }, [query, userOnly]);

  return (
    <div className="search-notes-container">
      <input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="search-input"
      />
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={userOnly}
          onChange={e => setUserOnly(e.target.checked)}
        />
        <span className="checkbox-text">Search only this user's notes</span>
      </label>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <ul className="notes-list">
          {notes.length > 0
            ? notes.map(note => (
                <li key={note.id} className="note-item">
                  <strong>{note.name}</strong>
                  <p className="note-message">
                    {decodeMessage(note.message)}
                  </p>
                </li>
              ))
            : query && (
                <li className="no-results">No matching notes found.</li>
              )}
        </ul>
      )}
    </div>
  );
};

export default SearchNotes;
