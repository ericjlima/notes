import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

axios.defaults.withCredentials = true;

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      notes: [],
      nodeID: 1,
      create: 'null',
      checkSessionID: null,
      pass: '',
      checkPass: null,
      passEntered: false,
      privateMode: null,
      privateText: 'none',
      hiddenTextarea: true,
      verificationMessage: null,
      dateModified: null,
      dateCreated: null,
      subnotes: [],
      // singleNoteData: null, //need this?
      message: null,
      value: '',
      data: 'null',
      timer: null,
    };
  }

  componentDidMount() {
    axios
      .get(`${this.props.baseURL}/api/notes/${this.props.match.params.id}`)
      .then(response => {
        //console.log('respon', response);
        response.data.forEach(e => {
          this.state.subnotes.push(e.subnote_title);
        });
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

          this.setState(
            {
              dateModified: strippedDateModified,
              dateCreated: strippedDateCreated,
              value: unescape(response.data[0].message),
              privateMode: response.data[0].private,
            },
            function() {
              if (response.data[0].private) {
                this.setState({message: '', privateText: 'Private On'});
              } else if (!response.data[0].private) {
                this.setState({
                  message: response.data[0].message,
                  privateText: 'Private Off',
                });
              }
              // console.log("privserver: "+response.data[0].private);
              // console.log("priv: "+this.state.privateMode);
            },
          );
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    //if i ever get to adding redux this will be handled quite easily and can remove the call below do same on subnotes page too?
    const getPassword = async () => {
      try {
        const response = await axios.get(
          `${this.props.baseURL}/api/password/${this.state.pass}`,
        );
        response.data.logged &&
          this.setState({
            passEntered: true,
            hiddenTextarea: false,
            checkPass: response.data.password,
            checkSessionID: response.data.sessionID,
          });

        //const responsepost = await axios.post(
        //`${this.props.baseURL}/api/notes/${this.props.match.params.id}`,
        //);

        //console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    getPassword();
  }

  handleCreateChange(e) {
      e.persist();
      //return txt.value.replace(/\r?\n/g, '<br />\n');
      //TODO: find when enter is pressed and replace with <br /> somehow...
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
      //.replace(/&#13;\r?\n/g, '<br />')
  }

  handleSubmit(e) {
    let passedUpdateData = this.state.value;
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

      const updateNote = async () => {
        try {
          if (this.state.passEntered) {
            await axios.post(
              `${this.props.baseURL}/api/notes/update/${this.props.match.params.id}`,
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

      updateNote();
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
            `${this.props.baseURL}/api/notes/${this.props.match.params.id}`,
          )
          .catch(function(error) {
            return JSON.stringify(error);
          });
        window.location.replace('/');
      }
    }
  }

  handlePrivate(e) {
    if (this.state.passEntered) {
      if (this.state.privateMode) {
        this.setState(
          {privateMode: 0, privateText: 'Private mode is off'},
          () => {
            axios
              .post(
                `${this.props.baseURL}/api/notes/private/${this.props.match.params.id}`,
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
            axios
              .post(
                `${this.props.baseURL}/api/notes/private/${this.props.match.params.id}`,
                {privateMode: this.state.privateMode},
              )
              .then(response => {})
              .catch(function(error) {
                return JSON.stringify(error);
              });
          },
        );
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
      <div className="notes">
        <div className="header">
          <h1>{this.toTitleCase(this.props.match.params.id)}</h1>
          <br />
          <ul className="subnotes-list">
            {this.state.subnotes.map((e, i) => {
              return (
                <li key={i}>
                  <Link to={this.props.match.params.id + '/' + e}>{e}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div dangerouslySetInnerHTML={{__html: unescape(this.state.message)}} />
        <br />
        <button
          style={hidden}
          className="pure-button pure-button-primary private-button"
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

export default Notes;
