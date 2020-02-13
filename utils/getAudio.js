const axios = require('axios');
const { lavalink } = require('../config.json')

module.exports = getAudio = async (query) => {
	const res = await axios.get(`http://${lavalink.host}:${lavalink.port}/loadtracks?identifier=${encodeURIComponent(query)}`, {
		headers: {
			Authorization: lavalink.password
		}
	})
	// TODO playlist support
	return res.data.tracks;
	// if (playlist)
	// 	return res.data.tracks
	// return res.data.tracks[0];
}