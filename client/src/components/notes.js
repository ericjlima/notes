import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

axios.defaults.withCredentials = true;

const Notes = (props) => {

    //TODO: can you condense the below with one use state. Maybe call it note and setUseNote with all the other properties.
    const [passEntered, setPassEntered] = useState(false);
    const [privateMode, setPrivateMode] = useState(0);
    const [privateText, setPrivateText] = useState('none');
    const [hiddenTextArea, setHiddenTextArea] = useState(true);
    const [verificationMessage, setVerificationMessage] = useState(null);
    const [dateModified, setDateModified] = useState(null);
    const [dateCreated, setDateCreated] = useState(null);
    const [childNotes, setChildNotes] = useState([]);
    const [message, setMessage] = useState(null);
    const [value, setValue] = useState('');
    const [timer, setTimer] = useState(null);

    const textAreaRef = useRef(null);


  //TODO: QA same notes names code a bit more
  //TODO: unmoutn anything? Study unmounting and why we use it.
  useEffect(() => {
    setChildNotes([]); //This line resolves a bug where the childnotes dont render. Not sure why. Guess you have to do this and it's a weird oddity of React.
    const getChildNotes = async (currentNoteData) => {
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
        if(!!children.length) setChildNotes(addChild);
      } catch (error) {
        console.error(error);
      }
    };

    const getNoteData = async () => {
      try {
        const secondLastParam = props.match.url.split('/')[props.match.url.split('/').length-2];
        //console.log('slp', secondLastParam);
        let response;



    const branches = Object.entries(props.match.params);
    const parentData = [];
    let pid;
    let previousNote;
    for(let i = 0; i < branches.length ; i++){
        console.log('brlanches', branches.length);
      if(i === 0) {
        pid = 0;
        response = await axios.get(
          `${props.baseURL}/api/notes/namepid/${branches[i][1]}/${pid}`
        );
        //console.log('xresponse', response);
        //console.log('xpid', pid);
        pid = response.data[0].id;
        //console.log('response', response);
        //console.log('pid', pid);
      } else {
        console.log('namepid', branches[i][1] + pid);
        response = await axios.get(
          `${props.baseURL}/api/notes/namepid/${branches[i][1]}/${pid}`
        );
        //TODO: errors on the last one because it wasn't created. Figure out a way to create it? or newshit has the wrong parent day8. onSubmit make sure to give the correct pid and namepid
        pid = response.data[0].id;
        console.log('response2', response);
        console.log('i', i);
      }
        console.log('branches', branches);
        //console.log('xresponse', response.data[0]);
    }






        //if(!secondLastParam){
          //response = await axios.get(`${props.baseURL}/api/notes/${props.match.params.id}`);
        //} else {
          //const secondLastResponse = await axios.get(`${props.baseURL}/api/notes/${secondLastParam}`);
          //console.log('secondLastResponse', secondLastResponse);
        //}
        console.log('1response', response)
        getChildNotes(response.data[0]);
        console.log('response', response)
    
        if (response.data[0].date_created) {
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

          setDateModified(strippedDateModified);
          setDateCreated(strippedDateCreated);
          setValue(unescape(response.data[0].message));
          setPrivateMode(response.data[0].private);
          const togglePrivateMode = () => {
            if (response.data[0].private) {
              setMessage('');
              setPrivateText('Private Mode Is On');
            } else if (!response.data[0].private) {
                setMessage(response.data[0].message);
                setPrivateText('Private Mode Is Off');
            }
          }
          togglePrivateMode();
        }
      } catch (error) {
        console.error(error);
      }
    };

    getNoteData();

  }, []);


  useEffect(() => {

    const getPassword = async () => {
      try {
        const response = await axios.get(
          `${props.baseURL}/api/password/`,
        );
        if(response.data.logged){
          setPassEntered(true);
          setHiddenTextArea(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getPassword();

  }, [passEntered]);

  const handleCreateChange = (e) => {
    e.persist();
    //return txt.value.replace(/\r?\n/g, '<br />\n');
    //TODO: find when enter is pressed and replace with <br /> somehow...
    clearTimeout(timer);
    setValue(e.target.value);

    setTimer(setTimeout(() => {
        handleSubmit(e);
      }, 2000));
  }

  const decodeHtml = (html) => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
    //.replace(/&#13;\r?\n/g, '<br />')
  }

  const createNotesParentBranches = async (passedUpdateData) => {
    const branches = Object.entries(props.match.params);
    const parentData = [];
    let pid;
    let previousNote;

    for(let i = 0; i < branches.length ; i++){
      if(i === 0) {
        await axios.post(
          `${props.baseURL}/api/notes/${branches[i][1]}`,
          {messageData: passedUpdateData, pid: 0}
        );
        previousNote = await axios.get(`${props.baseURL}/api/notes/${branches[i][1]}`);
      console.log('prevNotex', previousNote)
      } else {
        pid = previousNote.data[0].id;
      console.log('prevNote', previousNote);
        await axios.post(
        `${props.baseURL}/api/notes/${branches[i][1]}`,
        {messageData: passedUpdateData, pid: pid}
        );
      console.log('branches', branches)
        previousNote = await axios.get(`${props.baseURL}/api/notes/${branches[i][1]}`);
      console.log('prevNote2', previousNote)
      }
      await axios.post(
        `${props.baseURL}/api/notes/update/${props.match.params.id}`,//TODO: this has to go to namepd instead?
        {messageData: passedUpdateData},
      );
    }
    //for(let i = 0; i < branches.length ; i++){
      //if(i === 0) pid = 0; else pid = parentData[i-1][0].id;
      //await axios.post(
        //`${props.baseURL}/api/notes/update/${branches[i][1]}`,
        //{messageData: passedUpdateData, pid: pid},
      //);
    //}
    setVerificationMessage('Message was saved.');
    setMessage(value);
    setTimeout(() => {
        setVerificationMessage('');
    }, 2000);
  };

  const handleSubmit = e => {
    let passedUpdateData = value;
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

      const updateNote = async (passedUpdateData) => {
        try {
          if (passEntered) {
            if(!!value){
              createNotesParentBranches(passedUpdateData);
            }
          }
        } catch (error) {
            setVerificationMessage('Some kind of error occured:' + error);
            setMessage(value);
            console.error(error);
        }
      };

      updateNote(passedUpdateData);
    }
    e.preventDefault();
  }

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this record from the database?',
      )
    ) {
      if (window.confirm('Really delete?')) {
        const deleteNote = async () => {
          try{
		await axios.delete(
		  `${props.baseURL}/api/notes/${props.match.params.id}`,
		);
                setVerificationMessage('Deleting...');
		setTimeout( () => {
	          window.location.replace('/');
		}, 2000);
	  }  catch (error) {
	     console.log(error);
	  }
        };

        deleteNote();
      }
    }
  }

  const handlePrivate = e => {
    if (passEntered) {
      if (privateMode) {
          setPrivateMode(0); 
          setPrivateText('Private Mode Is Off');
          const postPrivateOff = () => {
            axios.post(
              `${props.baseURL}/api/notes/private/${props.match.params.id}`,
              {privateMode: 0},
            )
            .then(response => {})
            .catch(function(error) {
              return JSON.stringify(error);
            });
          }
          postPrivateOff();
      } else if (!privateMode) {
          setPrivateMode(1); 
          setPrivateText('Private Mode Is On');
          const postPrivateOn = () => {
            axios.post(
              `${props.baseURL}/api/notes/private/${props.match.params.id}`,
              {privateMode: 1},
            )
            .then(response => {})
            .catch(function(error) {
              return JSON.stringify(error);
            });
          };
          postPrivateOn();
      }
    }
  }

  const handleLogout = () => {
    axios
      .post(`${props.baseURL}/api/password/logout`)
      .then(response => {
        window.location.reload();
      })
      .catch(function(error) {
        return JSON.stringify(error);
      });
  }

  const toTitleCase = str => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

    var hidden = {
      display: hiddenTextArea ? 'none' : 'block',
    };

    return (
      <div className="notes">
          <Link
            to={props.match.url.substring(
              0,
              props.match.url.lastIndexOf('/'),
            )}>
            &lt; Back to {props.match.url.split('/')[props.match.url.split('/').length-2]}
          </Link> 
          <div className="header">
          <h1>{toTitleCase(props.match.params.id)}</h1>
          <br />
          <ul className="subnotes-list">
            {childNotes.map((e, i) => {
              return (
                <li key={i}>
                  <Link to={props.match.params.id + '/' + e} key={window.location.pathname}>{e}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div dangerouslySetInnerHTML={{__html: unescape(message)}} />
        <br />
        <button
          style={hidden}
          className={`pure-button pure-button-primary private-button ${!!privateMode && 'privateMode-button'}`}
          onClick={handlePrivate}>
          {privateText}
        </button>
        <form
          style={hidden}
          method="get"
          className="pure-form pure-form-aligned createNote"
          onSubmit={handleSubmit}>
          <fieldset>
            <div className="pure-control-group">
              <div className="pure-control-group">
                <textarea
                  onChange={handleCreateChange}
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
              className="pure-button pure-button-primary messageSubmit-button">
              Submit
            </button>
            <button
              className="pure-button pure-button-primary logout-button"
              onClick={handleLogout}>
              Logout
            </button>
            <button
              className="pure-button pure-button-primary deleteNote-button"
              onClick={handleDelete}>
              Delete
            </button>
            <p className="verificationMessage">
              {' '}
              {verificationMessage}{' '}
            </p>
          </fieldset>
        </form>
        <p>Date Created: {dateCreated}</p>
        <p>Date Modified: {dateModified}</p>
      </div>
    );
};

export default Notes;
