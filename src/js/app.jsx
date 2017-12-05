import React, { Component } from 'react';

import Editor from './components/editor';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import styles from './styles.module.css';

const options = [{
  value: 'red',
  label: 'red',
  text: '<p>it is <span style="color:rgb(209,72,65)">red</span> color</p>'
}, {
  value: 'blue',
  label: 'blue',
  text: '<p>it is <span style="color:rgb(41,105,176)">blue</span> color</p>'
}];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: options[0].text,
      select_value: options[0]
    };

    this.onChange = ::this.onChange;
    this.onSelectChange = ::this.onSelectChange;
  }

  onChange = (value) => {
    this.setState({
      value
    })
  };

  onSelectChange = (select_value) => {
    this.setState({
      select_value,
      value: select_value.text,
    }, () => {
      this._editor.setValue(select_value.text)
    })
  };

  render() {
    return (
      <div className={ styles.container }>
        <div className={ styles.marginTop }>
          <Select
            options={ options }
            value={ this.state.select_value }
            onChange={ this.onSelectChange }
          />
        </div>
        <div className={ styles.marginTop }>
          <Editor
            ref={ el => this._editor = el }
            value={ this.state.value }
            onChange={ this.onChange }
          />
        </div>
        <div className={ styles.marginTop }>
          { this.state.value }
        </div>
      </div>
    )
  }
}