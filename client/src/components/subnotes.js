import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class SubNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subnote: {},
      dateModified: null,
      dateCreated: null,
      hiddenTextarea: true,
      privateMode: null,
      value: '',
      pass: '',
    };
  }

  componentDidMount() {
    axios
      .get(
        `${this.props.baseURL}/api/subnotes/${this.props.match.params.id}/${this.props.match.params.sid}`,
      )
      .then(response => {
        this.setState({subnote: response.data});

        if (response.data.date_created) {
          let strippedDateCreated = response.data.date_created
            .replace(/T/g, ' ')
            .replace(/Z/g, '');
          strippedDateCreated = strippedDateCreated.substring(
            0,
            strippedDateCreated.indexOf('.'),
          );
          let strippedDateModified = response.data.date_modified
            .replace(/T/g, ' ')
            .replace(/Z/g, '');
          strippedDateModified = strippedDateModified.substring(
            0,
            strippedDateModified.indexOf('.'),
          );

          this.setState(
            {
              dateModified: strippedDateModified,
              dateCreated: strippedDateCreated,
              value: unescape(response.data.message),
              privateMode: response.data.private,
            },
            function() {
              if (response.data.private) {
                this.setState({message: '', privateText: 'Private Is On'});
              } else if (!response.data.private) {
                this.setState({
                  message: response.data.message,
                  privateText: 'Private Is Off',
                });
              }
            },
          );
          console.log('resposne, ', response)
          console.log('privateMode: ', this.state.privateMode)
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    axios
      .post(`${this.props.baseURL}/api/notes/${this.props.match.params.id}`)
      .then(response => {})
      .catch(function(error) {
        return JSON.stringify(error);
      });

    axios
      .get(`${this.props.baseURL}/api/password/${this.state.pass}`)
      .then(response => {
        if (response.data.logged) {
          this.setState({
            passEntered: true,
            hiddenTextarea: false,
            checkPass: response.data.password,
            checkSessionID: response.data.sessionID,
          });
        }
      })
      .catch(function(error) {
        return JSON.stringify(error);
      });
  }

  handlePrivate(e) {
    if (this.state.passEntered) {
      if (this.state.privateMode) {
        this.setState(
          {privateMode: 0, privateText: 'Private mode is off'},
          () => {
            axios
              .post(
                `${this.props.baseURL}/api/subnotes/private/${this.props.match.params.sid}`,
                {privateMode: this.state.privateMode},
              )
              .then(response => {})
              .catch(function(error) {
                return JSON.stringify(error);
              });
          },
        );
      } else if (!this.state.privateMode) {
        this.setState(
          {privateMode: 1, privateText: 'Private mode is on', message: ''},
          () => {
            console.log('hitx3')
            axios.post(
                `${this.props.baseURL}/api/subnotes/private/${this.props.match.params.sid}`,
                {privateMode: this.state.privateMode},
              )
              .then(response => {
console.log('iam the response', response);
              })
              .catch(function(error) {
                console.log(JSON.stringify(error));
                return JSON.stringify(error);
              });
            console.log('hit1x')
          },
        );
      }
    }
  }

  handleCreateChange(e) {
    e.persist();
    clearTimeout(this.state.timer);
    this.setState({
      value: e.target.value,
    });

    this.setState({
      timer: setTimeout(() => {
        this.handleSubmit(e);
      }, 2000),
    });
  }

  decodeHtml(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  handleSubmit(e) {
    let passedUpdateData = this.state.value;
    if (passedUpdateData) {
      passedUpdateData = encodeURIComponent(passedUpdateData);
      passedUpdateData = passedUpdateData
        .replace(/;/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/&#10;/g, '<br />');

      const updateSubNote = async () => {
        try {
              if (this.state.passEntered) {
                if(this.state.value){
                  let parId = 0;
                  const response = await axios.get(`${this.props.baseURL}/api/notes/${this.props.match.params.id}`);
                      parId = response.data[0].id;
                   axios.post(
                `${this.props.baseURL}/api/subnotes/${this.props.match.params.sid}/${parId}`,
                    );
                  }
                  axios.post(
                    `${this.props.baseURL}/api/subnotes/update/${this.props.match.params.sid}`,
                    {messageData: passedUpdateData},
                  );
                  this.setState({
                    verificationMessage: 'Message was saved.',
                    message: this.state.value,
                  });
                  setTimeout(() => {
                    this.setState({
                      verificationMessage: '',
                    });
                  }, 2000);
            }
        } catch (error) {
          this.setState({
            verificationMessage: 'Some kind of error occured:' + error,
            message: this.state.value,
          });
          console.error(error);
        }
      };

      updateSubNote();
    }
    e.preventDefault();
  }

  handleDelete() {
    if (
      window.confirm(
        'Are you sure you want to delete this record from the database?',
      )
    ) {
      if (window.confirm('Really delete?')) {
        axios
          .delete(
            `${this.props.baseURL}/api/subnotes/${this.props.match.params.sid}`,
          )
          .catch(function(error) {
            return JSON.stringify(error);
          });
        window.location.replace('/');
      }
    }
  }

  handleLogout() {
    axios
      .post(`${this.props.baseURL}/api/password/logout`)
      .then(response => {
        window.location.reload();
      })
      .catch(function(error) {
        return JSON.stringify(error);
      });
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  render() {
    var hidden = {
      display: this.state.hiddenTextarea ? 'none' : 'block',
    };
    return (
      <div>
        <div>
          <Link
            to={this.props.match.url.substring(
              0,
              this.props.match.url.lastIndexOf('/'),
            )}>
            &lt; Back to {this.props.match.params.id}
          </Link>
        </div>
        <div className="header">
          <h1>{this.toTitleCase(this.props.match.params.sid)}</h1>
          <br />
        </div>
        <div dangerouslySetInnerHTML={{__html: unescape(this.state.message)}} />
        <br />
        <button
          style={hidden}
          className={`pure-button pure-button-primary private-button ${!!this.state.privateMode && 'privateMode-button'}`}
          onClick={this.handlePrivate.bind(this)}>
          {this.state.privateText}
        </button>
        <form
          style={hidden}
          method="get"
          className="pure-form pure-form-aligned createNote"
          onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            <div className="pure-control-group">
              <div className="pure-control-group">
                <textarea
                  onChange={this.handleCreateChange.bind(this)}
                  id="create"
                  type="text"
                  value={this.decodeHtml(this.state.value)}
                  placeholder="Create"
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
              onClick={this.handleLogout.bind(this)}>
              Logout
            </button>
            <button
              className="pure-button pure-button-primary deleteNote-button"
              onClick={this.handleDelete.bind(this)}>
              Delete
            </button>
            <p className="verificationMessage">
              {' '}
              {this.state.verificationMessage}{' '}
            </p>
          </fieldset>
        </form>
        <p>Date Created: {this.state.dateCreated}</p>
        <p>Date Modified: {this.state.dateModified}</p>
      </div>
    );
  }
}

export default SubNotes;
