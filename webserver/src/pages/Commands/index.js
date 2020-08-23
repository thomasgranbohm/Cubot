import React, { Component } from 'react';

import './style.css'
import Command from '../../components/Command';

class Commands extends Component {
	constructor(props) {
		super(props)
		this.state = { commands: [], slidedIndex: null };
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
		fetch('/api/commands')
			.then(resp => resp.json())
			.then(json => this.setState({
				commands: json
			}));
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
			<div className="commands">
				{commands}
			</div>
		)
	}
}
export default Commands;