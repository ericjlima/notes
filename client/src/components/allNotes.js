import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {AuthenticatedContext} from '../App';

axios.defaults.withCredentials = true;

const AllNotes = props => {
  const [notes, setNotes] = useState([]);
  const {Authenticated} = useContext(AuthenticatedContext);

  useEffect(() => {
    if (Authenticated) {
      fetch(`${props.baseURL}/api/notes`)
        .then(res => res.json())
        .then(resnotes => {
          setNotes(resnotes);
        });
    } else {
      fetch(`${props.baseURL}/api/notes/publicNotes`)
        .then(res => res.json())
        .then(resnotes => {
          setNotes(resnotes);
        });
    }
  }, [Authenticated]);

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
