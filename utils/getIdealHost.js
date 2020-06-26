module.exports = getIdealHost = async (client) => {
	const foundNode = client.manager.idealNodes[0]
	return foundNode.id;
}