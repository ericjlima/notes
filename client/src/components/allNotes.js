import React, {useEffect, useState} from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AllNotes = props => {
  //const [passwordShown, setPassShown] = useState(true);
  //const [passEntered, setPassEntered] = useState(false);
  const [notes, setNotes] = useState([]);
  console.log('props', props);
  useEffect(() => {
    fetch(`${props.baseURL}/api/notes`)
      .then(res => res.json())
      .then(resnotes => {
        console.log('res', resnotes);
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
