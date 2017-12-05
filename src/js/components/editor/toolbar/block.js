import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Editor, EditorState, RichUtils} from 'draft-js';
import Button from './common/button';

const BLOCK_TYPES = [
  {label: 'UL', style: 'unordered-list-item', icon: 'fa-list-ul'},
  {label: 'OL', style: 'ordered-list-item', icon: 'fa-list-ol'},
];

export default class BlockControls extends Component {
  constructor(props) {
    super(props);

    this.onClick = ::this.onClick;
  }

  onClick = (blockType) => {
    this.props.onChange(
      RichUtils.toggleBlockType(this.props.value, blockType)
    )
  };

  render() {
    const {
      value,
      onChange,
    } = this.props;

    const selection = value.getSelection();
    const blockType = value
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className="inline-block">
        {BLOCK_TYPES.map((type) =>
          <Button
            key={ type.label }
            active={ type.style === blockType }
            onClick={ this.onClick }
            style={ type.style }
            icon={ type.icon }
          />
        )}
      </div>
    )
  }
}

BlockControls.proptTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};