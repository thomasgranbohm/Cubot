module.exports = getIdealHost = async (client) => {
	const foundNode = client.manager.nodes.find(node => node.ready && node.region === "amsterdam");
	if (foundNode) return foundNode;
	return client.manager.nodes.first();
}