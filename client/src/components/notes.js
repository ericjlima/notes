import React, {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {checkIfNoteExists} from '../utils/notePipelineHelper';
import {AuthenticatedContext} from '../App'; //call this authenitcated

axios.defaults.withCredentials = true;

const Notes = props => {
  const [passEntered, setPassEntered] = useState(false);
  const [pinnedNote, setPinnedNote] = useState(false);
  const [privateMode, setPrivateMode] = useState(0);
  const [privateText, setPrivateText] = useState('Private Mode is Off');
  const [hiddenTextArea, setHiddenTextArea] = useState(true);
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [dateModified, setDateModified] = useState(null);
  const [dateCreated, setDateCreated] = useState(null);
  const [childNotes, setChildNotes] = useState([]);
  const [loadOnce, setLoadOnce] = useState(false);
  const [value, setValue] = useState('');
  const [dataCurrentNote, setDataCurrentNote] = useState({});

  const textAreaRef = useRef(null);

  const privateCon = useContext(AuthenticatedContext);
  console.log('privateCon', privateCon);

  //TODO: Memory leak about an component not mounting? Click the back button and check what the console is saying. Ask around potentially
  useEffect(() => {
    setChildNotes([]); //This line resolves a bug where the childnotes dont render. Not sure why. Guess you have to do this and it's a weird oddity of React.

    getNoteData();
  }, []);

  useEffect(() => {
    const getPassword = async () => {
      try {
        const response = await axios.get(`${props.baseURL}/api/password/`);
        if (response.data.logged) {
          //TODO: get redux in here to deal with if the user is logged
          //await props.setLogged(true);
          setPassEntered(true);
          setHiddenTextArea(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getPassword();
  }, [passEntered]);

  useEffect(() => {
    const e = {};
    e.preventDefault = () => {
      return false;
    };
    //e.preventDefault = false;
    //return txt.value.replace(/\r?\n/g, '<br />\n');
    //TODO: find when enter is pressed and replace with <br /> somehow...
    const waitTwoSecondsBeforeSubmitting = setTimeout(() => {
      if (!loadOnce) {
        setLoadOnce(true);
      } else {
        handleSubmit(e);
      }
    }, 1000);
    return () => clearTimeout(waitTwoSecondsBeforeSubmitting);
  }, [value]);

  const getChildNotes = async currentNoteData => {
    try {
      //const secondLastParam = props.match.url.split('/')[props.match.url.split('/').length-2];
      const response = await axios.get(
        `${props.baseURL}/api/notes/children/${currentNoteData.id}`,
        //{slp: secondLastParam, pid: pid}
      );
      const children = response.data;
      let addChild;
      children.forEach(e => {
        addChild = childNotes;
        addChild.push(e.name);
      });
      if (!!children.length) setChildNotes(addChild);
    } catch (error) {
      console.error(error);
    }
  };

  const getNoteData = async () => {
    try {
      let response;
      const paths = Object.values(props.match.params);
      let pid;
      for (let i = 0; i < paths.length; i++) {
        if (i === 0) {
          pid = 0;
          response = await axios.get(
            `${props.baseURL}/api/notes/namepid/${paths[i]}/${pid}`,
          );
          //make the pin button red
          !!response.data[0] && (pid = response.data[0].id);
        } else {
          response = await axios.get(
            `${props.baseURL}/api/notes/namepid/${paths[i]}/${pid}`,
          );
          !!response.data[0] && (pid = response.data[0].id);
        }
      }

      if (!!response.data[0] && response.data[0].date_created) {
        let strippedDateCreated = response.data[0].date_created
          .replace(/T/g, ' ')
          .replace(/Z/g, '');
        strippedDateCreated = strippedDateCreated.substring(
          0,
          strippedDateCreated.indexOf('.'),
        );
        let strippedDateModified = response.data[0].date_modified
          .replace(/T/g, ' ')
          .replace(/Z/g, '');
        strippedDateModified = strippedDateModified.substring(
          0,
          strippedDateModified.indexOf('.'),
        );
        getChildNotes(response.data[0]);
        setDateModified(strippedDateModified);
        setDateCreated(strippedDateCreated);
        //console.log('response.data[0].message', response.data[0].message);
        setValue(unescape(response.data[0].message));
        setPrivateMode(response.data[0].private);
        //console.log('RESPECT', response);
        setDataCurrentNote(response);
        //setPinnedNote(getPinNote(response.data[0].id));
        const togglePrivateMode = () => {
          if (response.data[0].private) {
            setTimeout(() => {
              setVerificationMessage('In Private Mode!');
            }, 2000);

            setValue(unescape(response.data[0].message));
            setPrivateText('Private Mode Is On');
          } else if (!response.data[0].private) {
            setValue(unescape(response.data[0].message));
            setPrivateText('Private Mode Is Off');
          }
        };
        togglePrivateMode();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const decodeHtml = html => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
    //.replace(/&#13;\r?\n/g, '<br />')
  };

  const collectIdAndOrPostEachBranch = async (
    passedUpdateData,
    postBool,
    updateCurrNoteId,
    idNumber,
    moveDirectory,
  ) => {
    let paths = Object.values(props.match.params);
    if (moveDirectory) {
      paths = moveDirectory;
    }

    let pid = 0;
    let previousNote;

    for (let i = 0; i < paths.length; i++) {
      if (i === 0) {
        if (postBool) {
          await axios.post(`${props.baseURL}/api/notes/${paths[i]}`, {
            messageData: passedUpdateData,
            pid: 0,
          });
        }
        previousNote = await axios.get(
          `${props.baseURL}/api/notes/namepid/${paths[i]}/${pid}`,
        );
      } else {
        pid = previousNote.data[0].id;

        if (postBool) {
          await axios.post(`${props.baseURL}/api/notes/${paths[i]}`, {
            messageData: passedUpdateData,
            pid: pid,
          });
        }

        previousNote = await axios.get(
          `${props.baseURL}/api/notes/namepid/${paths[i]}/${pid}`,
        );
      }
    }

    if (updateCurrNoteId) {
      await axios.delete(
        `${props.baseURL}/api/notes/${previousNote.data[0].id}`,
      );
      await axios.post(
        `${props.baseURL}/api/notes/updatePid/${paths[paths.length - 1]}/${
          paths.length > 1 ? pid : 0
        }/${idNumber}`,
        {messageData: value},
      );
    }

    if (postBool && !updateCurrNoteId) {
      //This will only fire on a normal creation of a note and nothing to do with moving or renaming
      await axios.post(
        `${props.baseURL}/api/notes/update/${props.match.params.id}/${
          paths.length > 1 ? pid : 0
        }`,
        {messageData: passedUpdateData},
      );
    }

    return previousNote.data[0] ? previousNote.data[0].id : 0;
  };

  const updateNoteAndVerification = async passedUpdateData => {
    collectIdAndOrPostEachBranch(passedUpdateData, true);

    setVerificationMessage('Message was saved.');
    setValue(unescape(value));
    setTimeout(() => {
      setVerificationMessage('');
    }, 2000);
  };

  const formatDate = () => {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSubmit = e => {
    let passedUpdateData = value;
    //console.log('value', value);
    if (passedUpdateData) {
      //sql statements seem to error unless we replace these characters before making a query.
      passedUpdateData = encodeURIComponent(passedUpdateData);
      passedUpdateData = passedUpdateData
        //.replace(/&#10;/g, '<br />')
        //.replace(/&#13;/g, '<br />')
        //.replace(/<br\s?\/?>/g,"\n");
        //.replace(/\r\n|\r|\n/g,"<br />")
        .replace(/;/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

      const updateNote = async passedUpdateData => {
        try {
          if (passEntered) {
            if (!!value) {
              updateNoteAndVerification(passedUpdateData);
            }
          }
        } catch (error) {
          setVerificationMessage('Some kind of error occured:' + error);
          setValue(unescape(value));
          console.error(error);
        }
      };

      updateNote(passedUpdateData);

      setDateCreated(formatDate());
    }
    e.preventDefault();
  };

  const handleDelete = () => {
    if (!!childNotes.length) {
      alert("Can't delete this note. It has children.");
      return;
    }
    if (
      window.confirm(
        'Are you sure you want to delete this record from the database?',
      )
    ) {
      if (window.confirm('Really delete?')) {
        const deleteNote = async () => {
          try {
            const currNoteId = await collectIdAndOrPostEachBranch('');
            await axios.delete(`${props.baseURL}/api/notes/${currNoteId}`);
            setVerificationMessage('Note Deleted');
            setTimeout(() => {
              window.location.replace('/');
            }, 2000);
          } catch (error) {
            setVerificationMessage(
              'An error happened in deleting the note!!!!',
            );
            console.log(error);
          }
        };

        deleteNote();
      }
    }
  };

  const handlePrivate = () => {
    if (passEntered) {
      if (privateMode) {
        setPrivateMode(0);
        setPrivateText('Private Mode Is Off');
        const postPrivateOff = () => {
          axios
            .post(
              `${props.baseURL}/api/notes/private/${props.match.params.id}`,
              {privateMode: 0},
            )
            .catch(function (error) {
              return JSON.stringify(error);
            });
        };
        postPrivateOff();
      } else if (!privateMode) {
        setPrivateMode(1);
        setPrivateText('Private Mode Is On');
        const postPrivateOn = () => {
          axios
            .post(
              `${props.baseURL}/api/notes/private/${props.match.params.id}`,
              {privateMode: 1},
            )
            .catch(function (error) {
              return JSON.stringify(error);
            });
        };
        postPrivateOn();
      }

      //update the sidebar's state to not have private note show up anymore (toggles)
      props.setPinNotes([]);
      props.getPinNotes();
    }
  };

  const toTitleCase = str => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  var hidden = {
    display: hiddenTextArea ? 'none' : 'inline-block',
  };

  const moveNote = async () => {
    var destination = prompt('Enter path to move note to', 'my/example/note/b');

    if (destination === null || destination === '') {
      alert('You did not enter the note field.');
    } else {
      destination = destination.split('/').filter(function (el) {
        return el.length !== 0;
      });
      const noteExistence = await checkIfNoteExists(destination, props.baseURL);
      if (!noteExistence) {
        const oldPid = await collectIdAndOrPostEachBranch('');
        collectIdAndOrPostEachBranch('', true, true, oldPid, destination);
        const printDestination = destination.toString().replaceAll(',', '/');
        setVerificationMessage(
          'Note successfully moved to: ' + printDestination,
        );
      } else {
        alert(
          'Sorry a note already exists in that destination! Please, try a different destination',
        );
      }
    }
  };

  const setPinNote = async () => {
    //console.log('current note', dataCurrentNote.data[0]);
    if (dataCurrentNote.data[0]) {
      await axios.post(
        `${props.baseURL}/api/notes/setpin/${dataCurrentNote.data[0].namepid}`,
      );
      //const getPin = getPinNote(dataCurrentNote.data[0].id);
      //console.log('getPin', getPin);
      setPinnedNote(!pinnedNote);
    } else {
      alert('cant get current note');
    }

    //refresh side bar
    props.setPinNotes([]);
    props.getPinNotes();
  };

  //const getPinNote = async id => {
  //const res = await axios.get(`${props.baseURL}/api/notes/getPinNote/${id}`);
  //return res.data[0].pin;
  //};

  return (
    <div className="notes">
      <Link
        className="backToParent"
        to={props.match.url.substring(
          0,
          props.match.url.replace(/\/+$/, '').lastIndexOf('/'),
        )}>
        &lt; Back to{' '}
        {!!props.match.url.replace(/\/+$/, '').split('/')[
          props.match.url.replace(/\/+$/, '').split('/').length - 2
        ]
          ? props.match.url.replace(/\/+$/, '').split('/')[
              props.match.url.replace(/\/+$/, '').split('/').length - 2
            ]
          : 'Homepage'}
      </Link>
      <div className={`header ${privateMode && 'pure-button-primary'}`}>
        <h1>{toTitleCase(props.match.params.id)}</h1>
        <br />
        <ul className="subnotes-list">
          {childNotes.map((e, i) => {
            return (
              <li key={i}>
                <Link
                  to={window.location.pathname + '/' + e}
                  key={window.location.pathname}>
                  {e}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <br />

      <div className="noteContent">
        <div className={`leftSide ${!passEntered ? 'makeCenter' : ''}`}>
          {console.log('privateMode', privateMode)}
          {(!privateMode || passEntered) && (
            <div dangerouslySetInnerHTML={{__html: unescape(value)}} />
          )}
          <p>Date Modified: {dateModified}</p>
          <p>Date Created: {dateCreated}</p>
        </div>
        {passEntered && (
          <div className="rightSide">
            <div className="topRow">
              <p className="verificationMessage">{verificationMessage} </p>
              <br />
              <button
                style={hidden}
                className={`pure-button pure-button-primary private-button ${
                  !!privateMode && 'toggleRed-button'
                }`}
                onClick={handlePrivate}>
                {privateText}
              </button>
              {!!dateCreated && (
                <button
                  className="pure-button pure-button-primary bar-button"
                  onClick={moveNote}>
                  Move / Rename
                </button>
              )}
              {!!dateModified && (
                <button
                  className={`pure-button pure-button-primary bar-button ${
                    !!pinnedNote && 'toggleRed-button'
                  }`}
                  onClick={setPinNote}>
                  {!!pinnedNote ? 'UnPin' : 'Pin'}
                </button>
              )}
            </div>
            <div
              style={hidden}
              className="pure-form pure-form-aligned createNote">
              <fieldset>
                <div className="pure-control-group">
                  <div className="pure-control-group">
                    <textarea
                      onChange={event => setValue(unescape(event.target.value))}
                      id="create"
                      type="text"
                      value={decodeHtml(value)}
                      placeholder="Create"
                      ref={textAreaRef}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="pure-button pure-button-primary messageSubmit-button">
                  Submit
                </button>
                <button
                  className="pure-button pure-button-primary deleteNote-button"
                  onClick={handleDelete}>
                  Delete
                </button>
                <p className="verificationMessage"> {verificationMessage} </p>
              </fieldset>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
