import React, {Component} from 'react';
import MyEditor from './MyEditor';
import { Editor, EditorState} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Tx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 'null'
    };
  }


  render () {
    return (
      <MyEditor
  toolbarClassName="home-toolbar"
  wrapperClassName="home-wrapper"
  editorClassName="home-editor"
  onEditorStateChange={this.onEditorStateChange}
/>
    );
  }
}

export default Tx;
