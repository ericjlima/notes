import React, { Component } from 'react';
import axios from 'axios';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            term: '',
        };
    }

    onFormSubmit = e => {
        e.preventDefault();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <input 
                      type="text"
                      value={this.state.term}
                      onChange={e => this.setState({ term: e.target.value })}
                    />
                </form>
            </div>
        );
    }
}

export default SearchBar;
