import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

let { NODE_ENV, PUBLIC_URL } = process.env;

ReactDOM.render(
	// TODO this probably isn't the most efficient way
	<BrowserRouter basename={NODE_ENV === "production" ? PUBLIC_URL : '/'}>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);
