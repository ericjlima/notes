import React, {useEffect, useState} from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AllNotes = props => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetch(`${props.baseURL}/api/notes`)
      .then(res => res.json())
      .then(resnotes => {
        setNotes(resnotes);
      });
  }, []);

  const toTitleCase = str => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  return (
    <div className="allnotes">
      <div className="header">
        <h1>All Notes</h1>
        <br />
      </div>
      {notes.map((note, index) => (
        <li className="pure-menu-item" key={index}>
          <a className="pure-menu-link" href={`/${note.name}`}>
            {toTitleCase(note.name)}
          </a>
        </li>
      ))}
    </div>
  );
};

export default AllNotes;
