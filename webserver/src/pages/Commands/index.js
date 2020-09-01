import React, { Component } from 'react';

import './style.css'
import Command from '../../components/Command';
import Color from '../../components/Color';

class Commands extends Component {
	constructor(props) {
		super(props)
		this.state = {
			commands: [],
			categories: [],
			slidedIndex: null
		};
	}

	componentDidMount() {
		this.getCommands();
	}

	toggleSlided(index) {
		this.setState({
			slidedIndex: this.state.slidedIndex === index ?
				null :
				index
		});
	}

	getCommands() {
		let { PUBLIC_URL, NODE_ENV } = process.env;
		let link = (NODE_ENV === "production" ? PUBLIC_URL : '') + '/api/commands'
		fetch(link)
			.then(resp => resp.json())
			.then(({ commands, categories }) => this.setState({ commands, categories }));
	}

	render() {
		let commands = this.state.commands
			.slice()
			.map((command, i) => {
				let isSlided = i === this.state.slidedIndex;
				return <Command
					key={i}
					info={command}
					slided={isSlided}
					toggleSlided={() => this.toggleSlided(i)} />
			});
		return (
			<div>
				<nav className="color-palette">
					{this.state.categories.map(c => <Color {...c} key={c.name} />)}
				</nav>
				<div className="commands">
					{commands}
				</div>
			</div>
		)
	}
}
export default Commands;