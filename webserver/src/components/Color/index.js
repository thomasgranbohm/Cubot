import React from 'react';
import './style.css'

function Color(props) {
	return (
		<div className="color">
			<span className="showcase" style={{ "backgroundColor": `#${props.color}` }}></span>
			<span className="name"><b>{props.name}</b></span>
		</div>
	);
}

export default Color;