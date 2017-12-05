import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import ColorPicker from 'react-color-picker';
import cx from 'classnames';
import Button from './common/button';

const INLINE_STYLES = [
  {label: 'bold', style: 'BOLD', icon: 'fa-bold'},
  {label: 'italic', style: 'ITALIC', icon: 'fa-italic'},
  {label: 'underline', style: 'UNDERLINE', icon: 'fa-underline'},
];

export default class InlineControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
    };

    this.onClick = ::this.onClick;
    this._color = '#000000';
  }

  onClick = (inlineStyle) => {
    this.props.onChange(
      RichUtils.toggleInlineStyle(this.props.value, inlineStyle)
    );
  };

  onToggle = () => {
    this.setState({
      isOpened: !this.state.isOpened
    }, () => {
      if (this.state.isOpened) {
        this._colorPicker.focus();
      }
    })
  };

  onBlur = (e) => {
    const currentTarget = e.currentTarget;

    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.onToggle();
      }
    }, 0);
  };

  onChangeColor = (value) => {
    this._color = value;
    this.props.onChange(RichUtils.toggleInlineStyle(
      this.props.value,
      value
    ))
  };

  onSetColor = () => {
    const editorState = this.props.value;
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newContent = Modifier.applyInlineStyle(contentState, selection, this._color);
    if (!selection.isCollapsed()) {
      this.props.onChange(
        EditorState.push(editorState, newContent, 'change-inline-style')
      )
    }
  };

  render() {
    const {
      value,
      onChange,
    } = this.props;

    const currentStyle = value.getCurrentInlineStyle();

    return (
      <div className="RichEditor-inline-controls">
        {
          INLINE_STYLES.map(type =>
            <Button
              key={ type.label }
              active={ currentStyle.has(type.style) }
              onClick={ this.onClick }
              style={ type.style }
              icon={ type.icon }
            />
          )
        }
        <div className="inline-block interval-horizontal">
          <div className="relative">
            <span
              onClick={ this.onSetColor }
              className="RichEditor-inline-controls-color-picker"
              style={{
                color: this._color,
                borderColor: this._color,
              }}
            >А</span>
            <span onClick={ this.onToggle }>
            {
              this.state.isOpened ? (
                  <i className="fa fa-angle-up" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-angle-down" aria-hidden="true"></i>
                )
            }
            </span>
            <div
              className={ cx('RichEditor-inline-controls-color-dropdown', {
                hidden: !this.state.isOpened
              }) }
              tabIndex="1"
              onBlur={ this.onBlur }
              ref={ el => this._colorPicker = el }
            >
              <ColorPicker
                onChange={ this.onChangeColor }
                saturationWidth={ 200 }
                saturationHeight={ 200 }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

InlineControls.proptTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};