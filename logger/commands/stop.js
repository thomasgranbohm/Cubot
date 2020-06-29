const logger = require('../')

module.exports = stop = () => process.exit(0)

stop.desc = "Stops the process.";