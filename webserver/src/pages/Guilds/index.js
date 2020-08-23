import React, { Component } from 'react';
import './style.css';

import Guild from '../../components/Guild';

class Guilds extends Component {

	constructor(props) {
		super(props);

		this.clickGuild = this.clickGuild.bind(this);

		this.state = {
			guilds: [],
			clickedIndex: null
		}
	}

	clickGuild(index) {
		this.setState({
			clickedIndex:
				this.state.clickedIndex === index ?
					null :
					index
		});
	}

	componentDidMount() {
		fetch('/api/guilds')
			.then(resp => resp.json())
			.then(json => this.setState({ guilds: json }))
			.catch(err => {
				console.error(err);
			})
	}

	render() {
		let guilds = this.state.guilds
			.slice()
			.map((g, i) => <Guild
				key={g.id}
				info={g}
				clickGuild={() => this.clickGuild(i)}
				clicked={i === this.state.clickedIndex} />);
		return (
			<div className="guilds">
				{guilds}
			</div>
		);
	}

}

export default Guilds;