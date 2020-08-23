import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/'
import Commands from './pages/Commands/'
import Guilds from './pages/Guilds/'

function App() {
	return (
		<div className="container">
			<nav>
				<Link className="link" to="/">/</Link>
				<Link className="link" to="/commands">/commands</Link>
				<Link className="link" to="/guilds">/guilds</Link>
			</nav>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/commands" component={Commands} />
				<Route path="/guilds" component={Guilds} />
			</Switch>
		</div>
	);
}

export default App;
