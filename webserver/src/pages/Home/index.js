import React, { Component } from 'react';
import './style.css';

class Home extends Component {
	constructor(props) {
		super(props)

		let { PUBLIC_URL, NODE_ENV } = process.env;
		this.state = {
			PUBLIC_URL: (NODE_ENV === "production" ? PUBLIC_URL : ''),
			info: {
				members: undefined,
				guilds: undefined,
				players: undefined
			}
		}
	}

	componentDidMount() {
		let link = this.state.PUBLIC_URL + '/api/'
		fetch(link)
			.then(resp => resp.json())
			.then(info => {
				console.log(info)
				this.setState({ info })
			})
	}

	render() {
		let textElement = this.state.info ? <p>Serving <b>{this.state.info.members} people</b> in <b>{this.state.info.guilds} guilds</b>.</p> : undefined
		return (
			<div className="main">
				<img src={this.state.PUBLIC_URL + "/logo1024.png"} alt="CuBot logo" className="logo" />
				<div className="titles">
					<h1 className="title">CuBot</h1>
				</div>
				<div className="info">
					{textElement}
				</div>
				<a className="invite-link" href="https://discord.com/oauth2/authorize?client_id=536286702365310999&scope=bot">
					<p className="text"><b>Invite me!</b></p>
				</a>
			</div>
		)
	}
}

export default Home;