import React from 'react';
import { Route, Switch, NavLink as Link } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/'
import Commands from './pages/Commands/'
import Guilds from './pages/Guilds/'

function App() {
    let { NODE_ENV, PUBLIC_URL } = process.env;
    let public_url = (NODE_ENV === "production" ? PUBLIC_URL : '');
    return (
        <div className="container">
            <nav>
                <Link activeClassName="active" className="link" to="/" exact={true}>
                    <img src={public_url + "/public/images/home.svg"} alt="CuBot logo" />
                </Link>
                <Link activeClassName="active" className="link" to="/commands" >
                    <img src={public_url + "/public/images/commands.svg"} alt="Commands" />
                </Link>
                <Link activeClassName="active" className="link" to="/guilds" >
                    <img src={public_url + "/public/images/guilds.svg"} alt="Guilds" />
                </Link>
                <a className="link" style={{ marginLeft: "auto" }} href="https://github.com/thomasgranbohm/CuBot"><img src={public_url + "/public/images/github.svg"} alt="GitHub" /></a>
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
