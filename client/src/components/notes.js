import React, {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {checkIfNoteExists} from '../utils/notePipelineHelper';
import {firstPathSegment} from '../utils/urlHelper';
import {AuthenticatedContext} from '../App';
import SearchNotes from './SearchNotes';

axios.defaults.withCredentials = true;

const Notes = props => {
  const [pinnedNote, setPinnedNote] = useState(false);
  const [isPrivateNote, setIsPrivateNote] = useState(0);
  const [privateText, setPrivateText] = useState('Private Mode is Off');
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [dateModified, setDateModified] = useState(null);
  const [dateCreated, setDateCreated] = useState(null);
  const [showSection, setShowSection] = useState('write');
  const [childNotes, setChildNotes] = useState([]);
  const [loadOnce, setLoadOnce] = useState(false);
  const [value, setValue] = useState('');
  const [dataCurrentNote, setDataCurrentNote] = useState({});

  const MAX_TABS = 2;

  const textAreaRef = useRef(null);

  const {isLoggedIn, userCreds} = useContext(AuthenticatedContext);

  //TODO: Make the front end for only showing the current session user their own text box and not other peoples as well as think about pins working properly and private etc.
  //
  //Make a rename button and think about keeping things in the database lower case after talks with AI.

  useEffect(() => {
    setChildNotes([]); //This line resolves a bug where the childnotes dont render. Not sure why. Guess you have to do this and it's a weird oddity of React.
    getNoteData();
  }, []);

  useEffect(async () => {
    if (dataCurrentNote.data) {
      const getPin = await getPinNote(dataCurrentNote.data[0].id);
      setPinnedNote(getPin);
    }
  }, [dataCurrentNote]);

  useEffect(() => {
    const e = {};
    e.preventDefault = () => {
      return false;
    };

    const waitTwoSecondsBeforeSubmitting = setTimeout(() => {
      if (!loadOnce) {
        setLoadOnce(true);
      } else {
        handleSubmit(e);
      }
    }, 1000);
    return () => clearTimeout(waitTwoSecondsBeforeSubmitting);
  }, [value]);

  const handleKeyPress = event => {
    if (event.key === 'Enter' && event.shiftKey) {
      var firstSearchString = '<br />';
      const field = document.getElementById('message_textarea');
      insertAtCursor(field, firstSearchString);
    }
  };

  const insertAtCursor = (myField, myValue) => {
    if (myField.selectionStart || myField.selectionStart === '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
    } else {
      myField.value += myValue;
    }
  };

  //const getChildNotes = async currentNoteData => {
  //try {
  //const response = await axios.get(
  //`${props.baseURL}/api/notes/children/${currentNoteData.id}`,
  //);
  //const children = response.data;
  //let addChild;
  //children.forEach(e => {
  //addChild = childNotes;
  //addChild.push(e.name);
  //});
  //if (!!children.length) setChildNotes(addChild);
  //} catch (error) {
  //console.error(error);
  //}
  //};

  const fetchNoteData = async () => {
    const paths = Object.values(props.match.params);
    let pid = 0;
    let response;

    for (let i = 0; i < paths.length; i++) {
      response = await axios.get(
        `${props.baseURL}/api/notes/namepid/${paths[i].toLowerCase()}/${pid}`,
      );

      if (!!response.data[0]) {
        pid = response.data[0].id;
      }
    }

    //return response?.data[0] || null;  //This only works in newer versions of javascript
    return response && response.data && response.data[0]
      ? response.data[0]
      : null;
  };

  const applyNoteDataToState = async noteData => {
    if (!noteData) return;

    //Dates data
    const strippedDateCreated = noteData.date_created
      .replace(/T/g, ' ')
      .replace(/Z/g, '')
      .substring(0, noteData.date_created.indexOf('.'));

    const strippedDateModified = noteData.date_modified
      .replace(/T/g, ' ')
      .replace(/Z/g, '')
      .substring(0, noteData.date_modified.indexOf('.'));

    setDateModified(strippedDateModified);
    setDateCreated(strippedDateCreated);

    //Main note value data
    setValue(unescape(noteData.message));
    setDataCurrentNote({data: [noteData]});

    //Privacy State
    setIsPrivateNote(noteData.private);

    if (noteData.private) {
      setTimeout(() => {
        setVerificationMessage('In Private Mode!');
      }, 2000);
      setPrivateText('Private Mode Is On');
    } else {
      setPrivateText('Private Mode Is Off');
    }

    //Child note data
    const children = await axios.get(
      `${props.baseURL}/api/notes/children/${noteData.id}`,
    );
    const childNames = children.data.map(c => c.name);
    setChildNotes(childNames);
  };

  const getNoteData = async () => {
    const noteData = await fetchNoteData();
    console.log(noteData);
    //getChildNotes(response.data[0]);
    await applyNoteDataToState(noteData);
    return noteData;
  };

  //const getNoteData = async () => {
  //try {
  //let response;
  //const paths = Object.values(props.match.params);
  //let pid;
  //for (let i = 0; i < paths.length; i++) {
  //if (i === 0) {
  //pid = 0;

  //response = await axios.get(
  //`${props.baseURL}/api/notes/namepid/${paths[i].toLowerCase()}/${pid}`,
  //);
  //console.log('response', response);
  //!!response.data[0] && (pid = response.data[0].id);
  //} else {
  //console.log('paths', paths);
  //console.log('paths[i]', paths[i]);
  //console.log('pid', pid);

  //response = await axios.get(
  //`${props.baseURL}/api/notes/namepid/${paths[i].toLowerCase()}/${pid}`,
  //);
  //console.log('response2', response);
  //!!response.data[0] && (pid = response.data[0].id);
  //console.log('pid', response.data[0].date_created);
  //}
  //}

  //if (!!response.data[0] && response.data[0].date_created) {
  //let strippedDateCreated = response.data[0].date_created
  //.replace(/T/g, ' ')
  //.replace(/Z/g, '');
  //strippedDateCreated = strippedDateCreated.substring(
  //0,
  //strippedDateCreated.indexOf('.'),
  //);
  //console.log('stripped', strippedDateCreated);
  //let strippedDateModified = response.data[0].date_modified
  //.replace(/T/g, ' ')
  //.replace(/Z/g, '');
  //strippedDateModified = strippedDateModified.substring(
  //0,
  //strippedDateModified.indexOf('.'),
  //);
  //getChildNotes(response.data[0]);
  //setDateModified(strippedDateModified);
  //setDateCreated(strippedDateCreated);
  //setValue(unescape(response.data[0].message));
  //setIsPrivateNote(response.data[0].private);
  //setDataCurrentNote(response);
  //const togglePrivateMode = () => {
  //if (response.data[0].private) {
  //setTimeout(() => {
  //setVerificationMessage('In Private Mode!');
  //}, 2000);
  //setValue(unescape(response.data[0].message));
  //setPrivateText('Private Mode Is On');
  //} else if (!response.data[0].private) {
  //setValue(unescape(response.data[0].message));
  //setPrivateText('Private Mode Is Off');
  //}
  //};
  //togglePrivateMode();
  //}
  //} catch (error) {
  //console.error(error);
  //}
  //};

  const decodeHtml = html => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
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
            userCreds: userCreds,
            routeUsername: firstPathSegment(),
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
            userCreds: userCreds,
            routeUsername: firstPathSegment(),
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
        {userCreds: userCreds, routeUsername: firstPathSegment()},
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
        {
          messageData: passedUpdateData,
          userCreds: userCreds,
          routeUsername: firstPathSegment(),
        },
      );
    }

    return previousNote.data[0] ? previousNote.data[0].id : 0;
  };

  const updateNoteAndVerification = async passedUpdateData => {
    await collectIdAndOrPostEachBranch(passedUpdateData, true);
    const updatedNote = await fetchNoteData();
    await applyNoteDataToState(updatedNote);

    setVerificationMessage('Message was saved.');
    setValue(unescape(value));
    setTimeout(() => {
      setVerificationMessage('');
    }, 2000);
  };

  const userOnOwnPath = () => {
    return firstPathSegment() === '@' + userCreds.username;
  };

  const handleSubmit = e => {
    let passedUpdateData = value;
    if (passedUpdateData) {
      //sql statements seem to error unless we replace these characters before making a query.
      passedUpdateData = encodeURIComponent(passedUpdateData);
      passedUpdateData = passedUpdateData
        .replace(/;/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

      const updateNote = async passedUpdateData => {
        try {
          if (isLoggedIn) {
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
    if (isLoggedIn) {
      if (isPrivateNote) {
        setIsPrivateNote(0);
        setPrivateText('Private Mode Is Off');
        const postPrivateOff = () => {
          axios
            .post(
              `${props.baseURL}/api/notes/private/${props.match.params.id}`,
              {isPrivateNote: 0},
            )
            .catch(function (error) {
              return JSON.stringify(error);
            });
        };
        postPrivateOff();
      } else if (!isPrivateNote) {
        setIsPrivateNote(1);
        setPrivateText('Private Mode Is On');
        const postPrivateOn = () => {
          axios
            .post(
              `${props.baseURL}/api/notes/private/${props.match.params.id}`,
              {isPrivateNote: 1},
            )
            .catch(function (error) {
              return JSON.stringify(error);
            });
        };
        postPrivateOn();
      }

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
    display: !isLoggedIn ? 'none' : 'inline-block',
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
    if (dataCurrentNote.data[0]) {
      await axios.post(
        `${props.baseURL}/api/notes/setpin/${dataCurrentNote.data[0].namepid}`,
      );
      setPinnedNote(!pinnedNote);
    } else {
      alert('cant get current note');
    }

    //refresh side bar
    props.setPinNotes([]);
    props.getPinNotes();
  };

  const getPinNote = async id => {
    const res = await axios.get(`${props.baseURL}/api/notes/getPinNote/${id}`);
    return res.data[0].pin;
  };

  return (
    <div className="notes">
      <Link
        className="pure-button backToParent"
        to={props.match.url.substring(
          0,
          props.match.url.replace(/\/+$/, '').lastIndexOf('/'),
        )}
      >
        <span>&#8249;</span> Back to{' '}
        {!!props.match.url.replace(/\/+$/, '').split('/')[
          props.match.url.replace(/\/+$/, '').split('/').length - 2
        ]
          ? props.match.url.replace(/\/+$/, '').split('/')[
              props.match.url.replace(/\/+$/, '').split('/').length - 2
            ]
          : 'Homepage'}
      </Link>
      <div
        className={`header ${isPrivateNote && isLoggedIn && userOnOwnPath() && 'pure-button-primary'}`}
      >
        <div className="tab-bar">
          {(!isPrivateNote || (userOnOwnPath() && isLoggedIn)) && (
            <ul className="subnotes-tabs">
              <div
                onClick={() => setShowSection('write')}
                className={`tab search-tab ${showSection === 'write' ? 'active-tab' : ''}`}
              >
                Write
              </div>
              <div
                onClick={() => setShowSection('read')}
                className={`tab search-tab ${showSection === 'read' ? 'active-tab' : ''}`}
              >
                Read
              </div>
              <div
                onClick={() => setShowSection('search')}
                className={`tab search-tab ${showSection === 'search' ? 'active-tab' : ''}`}
              >
                Search
              </div>
              {childNotes.map((e, i) => (
                <li className="tab" key={i}>
                  <Link to={`${props.match.url.replace(/\/+$/, '')}/${e}`}>
                    {e}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="noteContentContainer">
      {showSection === 'search' && <SearchNotes baseURL={props.baseURL} />}
        {showSection === 'write' && (
          <div className="noteWriteContent">
            {/*TODO: put this in a better div*/}
            <h1>{toTitleCase(props.match.params.id)}</h1>
          /*TODO: think about subnotes on production.. this temp fix gets things renabled for yourself
          && userOnOwnPath()
          */
            {isLoggedIn && (
              <div>
                <div className="topRow">
                  <p className="verificationMessage">{verificationMessage} </p>
                  <br />
                  <button
                    style={hidden}
                    className={`pure-button pure-button-primary private-button ${
                      !!isPrivateNote && userOnOwnPath() && 'toggleRed-button'
                    }`}
                    onClick={handlePrivate}
                  >
                    {privateText}
                  </button>
                  {!!dateCreated && (
                    <button
                      className="pure-button pure-button-primary bar-button"
                      onClick={moveNote}
                    >
                      Move / Rename
                    </button>
                  )}
                  {!!dateModified && (
                    <button
                      className={`pure-button pure-button-primary bar-button ${
                        !!pinnedNote && 'toggleRed-button'
                      }`}
                      onClick={setPinNote}
                    >
                      {!!pinnedNote ? 'UnPin' : 'Pin'}
                    </button>
                  )}
                </div>
                <div
                  style={hidden}
                  className="pure-form pure-form-aligned createNote"
                >
                  <fieldset>
                    <div className="pure-control-group">
                      <div className="pure-control-group">
                        <textarea
                          onChange={event =>
                            setValue(unescape(event.target.value))
                          }
                          onKeyPress={event => handleKeyPress(event)}
                          id="message_textarea"
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
                      className="pure-button pure-button-primary messageSubmit-button"
                    >
                      Submit
                    </button>
                    <button
                      className="pure-button pure-button-primary deleteNote-button"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <p className="verificationMessage">
                      {' '}
                      {verificationMessage}{' '}
                    </p>
                  </fieldset>
                </div>
              </div>
            )}
          </div>
        )}

        {showSection === 'read' && (
          <div className="noteWriteContent">
            <div
              className={`leftSide ${!(isLoggedIn && userOnOwnPath()) ? 'makeCenter' : ''}`}
            >
              {(!isPrivateNote || (isLoggedIn && userOnOwnPath())) && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: unescape(value.replace(/\n/g, '<br />')),
                  }}
                />
              )}
              {(!isPrivateNote ||
                (isPrivateNote && isLoggedIn && userOnOwnPath())) &&
                dateModified && <p>Date Modified: {dateModified}</p>}
              {(!isPrivateNote ||
                (isPrivateNote && isLoggedIn && userOnOwnPath())) &&
                dateCreated && <p>Date Created: {dateCreated}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
