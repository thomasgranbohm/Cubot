import React, { Component } from 'react';
import './style.css'

class Command extends Component {

	constructor(props) {
		super(props);
		this.state = {
			command: props.info,
			slided: props.slided
		};

		this.toggleSlided = this.toggleSlided.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			slided: nextProps.slided
		});
	}

	toggleSlided() {
		this.props.toggleSlided()
	}

	render() {
		let { command, slided } = this.state;
		return (
			<div className={`command ${slided ? "slided" : ""}`}
				id={command.name}
				onClick={() => this.toggleSlided()} >
				<div className="command-inner"
					style={{ "--gradient-color": `#${command.category.color}` }}>
					<div className="command-front">
						<h2 className="title">{command.name}</h2>
					</div>
					<div className="divider"></div>
					<div className="command-back py-2 px-3 d-flex flex-column flex-justify-evenly">
						<div>
							<h5>Description</h5>
							<code className="description">{command.shortDesc} </code>
						</div>
						<div style={{ display: (command.aliases && command.aliases.length > 0 ? "block" : "none") }}>
							<h5>Aliases</h5>
							<code>{command.aliases.join(", ")}</code>
						</div>
						<div>
							<h5>Usage</h5><code className="usage">!{command.name} {command.usage}</code>
						</div>
					</div>
				</div>
			</div >
		)
	}

}

export default Command;