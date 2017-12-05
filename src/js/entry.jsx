import 'normalize.css';

import React from 'react';
import { render } from 'react-dom';

import Editor from './app';

const appRoot = document.getElementById('app');
if (!(appRoot instanceof HTMLElement)) {
  throw new Error('Element #app is not found');
}

render(<Editor/>, appRoot);
