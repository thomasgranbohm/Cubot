const logger = require('../logger.js')

module.exports = stop = () => process.exit(0)

stop.desc = "Stops the process.";