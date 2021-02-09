import React, {useEffect, useState} from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AllNotes = props => {
  //const [passwordShown, setPassShown] = useState(true);
  //const [passEntered, setPassEntered] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch(`${props.baseURL}/api/notes`)
      .then(res => res.json())
      .then(resnotes => { console.log('res', resnotes); setNotes(resnotes) } );
  }, []);

  return (
    <div className="allnotes">
      <div className="header">
        <h1>All Notes</h1>
        <br />
      </div>
      {notes.map((note, index) => (
        <li className="pure-menu-item" key={index}>
          <a className="pure-menu-link" href={`/${note.name}`}>
            {props.toTitleCase(note.name)}
          </a>
        </li>
      ))}
      
    </div>
  );
};

export default AllNotes;
