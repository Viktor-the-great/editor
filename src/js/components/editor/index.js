import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Editor } from 'react-draft-wysiwyg';
import 'css/react-draft-wysiwyg.css';

import {
  Modifier,
  EditorState,
} from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';

const convertToHTMLConfig = {
  styleToHTML: (style) => {
    if (style && style.indexOf('color-') === 0) {
      return <span style={{ color: style.substr(6) }}/>;
    } else if (style && style.indexOf('bgcolor-') === 0) {
      return <span style={{ backgroundColor: style.substr(8) }}/>;
    } else if (style && style.indexOf('fontsize-') === 0) {
      return <span style={{ fontSize: `${ style.substr(9) }pt`, lineHeight: `${ style.substr(9) }pt` }}/>;
    }
  },
  blockToHTML: (block) => {
    if (block.type === 'unordered-list-item') {
      const listStyleType = block.depth === 0 ? 'disc' : block.depth === 1 ? 'circle' : 'square';
      return {
        element: <li style={{ listStyleType }}/>,
        nest: <ul />
      }
    }
  }
};

const convertFromHTMLConfig = {
  htmlToStyle: (nodeName, node, currentStyle) => {
    if (nodeName === 'ins') {
      return currentStyle.add('UNDERLINE');
    } else if (nodeName === 'span' && node.style.fontSize) {
      return currentStyle.add(`fontsize-${ node.style.fontSize.slice(0, -2) }`)
    } else if (nodeName === 'span' && node.style.color) {
      return currentStyle.add(`color-${ node.style.color }`)
    } else if (nodeName === 'span' && node.style.backgroundColor) {
      return currentStyle.add(`bgcolor-${ node.style.backgroundColor }`)
    } else {
      return currentStyle
    }
  }
};

export default class EditorComponent extends Component {
  constructor(props) {
    super(props);

    const value = props.value.split('\r').join('<br/>');

    const editorState = EditorState.createWithContent(
      convertFromHTML(convertFromHTMLConfig)(value)
    );

    this.state = {
      value: EditorState.moveSelectionToEnd(editorState)
    };

    this.onChange = ::this.onChange;
    this.onChangeValue = debounce(this.onChangeValue, 50)
  }

  onChange = (value) => {
    this.setState({
      value
    }, () => {
      if (!this.props.onChange)
        return;

      this.onChangeValue(value);
    })
  };

  onChangeValue = (value) => {
    const context = value.getCurrentContent();
    if (context.getPlainText()) {
      value = convertToHTML(convertToHTMLConfig)(context);
    } else {
      value = '';
    }

    this.props.onChange(value);
  };

  setValue = (value) => {
    value = value.split('\r').join('<br/>');

    const editorState = EditorState.createWithContent(
      convertFromHTML(convertFromHTMLConfig)(value)
    );

    this.setState({
      value: editorState
    })
  };

  handlePastedText = (text) => {
    const editorState = this.state.value;
    const newState = Modifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(), text.trim());
    this.onChange(EditorState.push(editorState, newState, 'insert-fragment'));

    return true;
  };

  render() {
    const {
      placeholder,
      spellCheck,
    } = this.props;

    return (
      <div>
        <Editor
          spellCheck={ spellCheck }
          placeholder={ placeholder }
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'colorPicker'],
            inline: {
              options: ['bold', 'italic', 'underline']
            },
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'Blockquote'],
            },
          }}
          editorState={ this.state.value }
          onEditorStateChange={ this.onChange }
          onBlur={ e => e.preventDefault() }

          handlePastedText={ this.handlePastedText }
        />
      </div>
    )
  }
}

EditorComponent.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  spellCheck: PropTypes.bool,
  maxDepth: PropTypes.number,
};

EditorComponent.defaultProps = {
  value: '',
  spellCheck: true,
  maxDepth: 4,
};