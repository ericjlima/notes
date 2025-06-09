import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';

import {retrievePaths} from './utils/notePipelineHelper';
import Notes from './components/notes';
import Login from './components/login';
import SignupPage from './components/signupPage';
import AllNotes from './components/allNotes';
//import QuickLogin from './components/quickLogin';
//import UserProfile from './components/userProfile';
import axios from 'axios';
import './App.css';

axios.defaults.withCredentials = true;

export const AuthenticatedContext = React.createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCreds, setUserCreds] = useState('');
  const [activeMenu, setActiveMenu] = useState('');
  const [pinNotes, setPinNotes] = useState([]);
  const AuthenticatedContextValue = {
    isLoggedIn,
    setIsLoggedIn,
    userCreds,
    setUserCreds,
  };

  const baseURL = ''; // Adjust base URL if needed

  useEffect(() => {
    getPinNotes();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/login/me`);
        console.log('response', response);
        if (response.data && response.data.user) {
          setIsLoggedIn(true);
          setUserCreds(response.data.user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/api/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsLoggedIn(false);
  };

  const getPinNotes = async () => {
    const pinNotesCallback = await axios.get(`${baseURL}/api/notes/pinNotes/`);

    pinNotesCallback.data.map(async note => {
      const thepath = await retrievePaths(note.name, note.namepid, baseURL);
      setPinNotes(pinNotes => [...pinNotes, thepath]);
    });
  };

  const handleClick = () => {
    if (activeMenu === 'active') {
      setActiveMenu('');
    } else {
      setActiveMenu('active');
    }
  };

  const toTitleCase = str => {
    if (str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
    return str;
  };

  const generateChildNoteRoutes = () => {
    const result = [];
    let stringRes = '/:id';

    for (let i = 1; i < 299; i++) {
      stringRes = '/:id' + i + stringRes;
      result.unshift(
        <Route
          path={stringRes}
          key={i}
          render={routeProps => (
            <Notes
              {...routeProps}
              getPinNotes={getPinNotes}
              setPinNotes={setPinNotes}
              baseURL={baseURL}
              key={window.location.pathname}
            />
          )}
        />,
      );
    }
    return result;
  };

  return (
    <AuthenticatedContext.Provider value={AuthenticatedContextValue}>
      <div id="layout" className={`${activeMenu}`}>
        <div id="main">
          <div className="content">
            <Router>
              <div>
                <a
                  href="#menu"
                  id="menuLink"
                  onClick={() => handleClick()}
                  className={`menu-link`}
                >
                  <span></span>
                </a>
                <div id="menu">
                  <div className="pure-menu">
                    <NavLink
                      activeClassName="pure-menu-selected"
                      className="pure-menu-heading"
                      to="/"
                    >
                      Eric's Notes
                    </NavLink>
                    {!isLoggedIn && (
                      <div>
                        <li className="pure-menu-item" key="login">
                          <a className="pure-menu-link" href={`/login`}>
                            Login
                          </a>
                        </li>
                        <li className="pure-menu-item" key="signup">
                          <a className="pure-menu-link" href={`/signup`}>
                            Sign Up
                          </a>
                        </li>
                      </div>
                    )}

                    {isLoggedIn && (
                      <button onClick={handleLogout}>Logout</button>
                    )}

                    <ul className="pure-menu-list">
                      {/*<QuickLogin baseURL={baseURL} setAuthenticated={setAuthenticated} />*/}
                      <li className="pure-menu-item" key="0">
                        <a className="pure-menu-link" href={`/login`}>
                          Login
                        </a>
                      </li>
                      <li className="pure-menu-item" key="1">
                        <a className="pure-menu-link" href={`/allNotes`}>
                          All Notes
                        </a>
                      </li>
                      {pinNotes.map((note, index) => {
                        return (
                          <li className="pure-menu-item" key={index}>
                            <a className="pure-menu-link" href={`/${note.url}`}>
                              {toTitleCase(note.name)}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <Switch>
                  <Route
                    path={'/login'}
                    render={routeProps => (
                      <Login {...routeProps} baseURL={baseURL} />
                    )}
                  />
                  <Route
                    path={'/signup'}
                    render={routeProps => (
                      <SignupPage {...routeProps} baseURL={baseURL} />
                    )}
                  />
                  <Route
                    path={'/allnotes'}
                    render={routeProps => (
                      <AllNotes
                        {...routeProps}
                        baseURL={baseURL}
                        toTitleCase={toTitleCase()}
                      />
                    )}
                  />
                  {generateChildNoteRoutes()}
                  <Route
                    path={'/:id'}
                    render={routeProps => (
                      <Notes
                        {...routeProps}
                        baseURL={baseURL}
                        getPinNotes={getPinNotes}
                        setPinNotes={setPinNotes}
                      />
                    )}
                  />
                  <Route
                    path={'/'}
                    render={() => (
                      <div className="vertical-center">
                        <h3>This is Eric Lima's notes website.</h3>
                      </div>
                    )}
                  />
                  <Redirect from="*" to="/" />
                </Switch>
              </div>
            </Router>
          </div>
        </div>
      </div>
    </AuthenticatedContext.Provider>
  );
};

export default App;
