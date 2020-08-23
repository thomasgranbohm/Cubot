import React, { Component } from 'react';
import "./style.css";

class Guild extends Component {

	constructor(props) {
		super(props);

		this.clickGuild = this.clickGuild.bind(this);

		this.state = {
			info: props.info,
			clicked: props.clicked
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			clicked: nextProps.clicked
		});
	}

	clickGuild() {
		this.props.clickGuild();
	}

	render() {
		let guild = this.state.info;
		return (
			<div className={`guild ${this.state.clicked ? "clicked" : ""}`}
				id={guild.name}
				onClick={() => this.clickGuild()}>
				<div className="guild-inner">
					<div className="guild-front">
						<img src={guild.icon} alt={guild.name} className="guild-icon" />
						<h2 className="title">{guild.name}</h2>
					</div>
					<div className="divider"></div>
					<div className="guild-back">
						<div>
							<h5>Members</h5>
							<code>{guild.members}</code>
						</div>
						<div>
							<h5>Channels</h5>
							<code>{guild.channels}</code>
						</div>
						<div>
							<h5>Owner</h5>
							<code>{guild.owner.displayName}</code>
						</div>
					</div>
				</div>
			</div >
		)
	}

}

export default Guild;