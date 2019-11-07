import React, { Component } from 'react';
import axios from 'axios';



class SubNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    componentDidMount(){
        axios.get(`${this.props.baseURL}/api/notes/${this.props.match.params.id}/${this.props.match.params.sid}`)
        .then((response) => {
            console.log('response: ', response.data);
        })
        .catch(function(error){
          console.log(error)
        });
    }

    render(){

        return(
            "i'm a subnote"
        );

    }
}

export default SubNotes;
