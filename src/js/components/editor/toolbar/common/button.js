import React, {Component} from 'react';
import cx from 'classnames';

export default class Button extends Component {
  onClick = (e) => {
    e.preventDefault();
    this.props.onClick(this.props.style)
  };

  render() {
    const {
      className,
      icon,
      active,
    } = this.props;

    return (
      <span
        className={ cx('interval-horizontal link', className) }
        onMouseDown={ this.onClick }
      >
        <i className={ cx(`fa ${ icon }`, {active}) } aria-hidden="true"></i>
      </span>
    )
  }
}