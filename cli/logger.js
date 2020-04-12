const chalk = require("chalk");
const { promises } = require('fs')
const { stdin, stdout } = process;
const readline = require('readline');
const { format } = require('util')
const client = require("../CuBot.js")

let commands = {};
let selectedGuild = undefined;
let cursorPos = 0;
let historyPos = 0;
let input = [];
let history = [];
let acceptableChars = 'abcdefghijklmnopqrstuvwxyzåäöABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ1234567890!"#¤%&/()=?\`,.-<>*^\'\\@£$€¥{[]}¡¶§½|øæ";:_¸·̣̣ +-'
let customPrompt = `${selectedGuild ? `${selectedGuild.name} ` : ''}> `

let start = async () => {
	readline.emitKeypressEvents(stdin)
	if (process.stdin.isTTY) {
		process.stdin.setRawMode(true);
	}
	let commandFiles = await promises.readdir(process.cwd() + "/cli/commands");
	await commandFiles.filter(file => file.endsWith(".js"))
		.map(file => require(`${process.cwd()}/cli/commands/${file}`))
		.sort((a, b) => a.name.localeCompare(b.name))
		.forEach(command => module.exports.commands[command.name] = command);
	printPrompt()
};

let print = (...args) => {
	stdout.cursorTo(0)
	stdout.clearLine(0)
	stdout.write(`${args.join(" ")}\n`)
	printPrompt()
}

let log = (baseString, ...args) => print(chalk.green("General:"), format(baseString, ...args));
let web = (baseString, ...args) => print(chalk.green("General:"), format(baseString, ...args));
let error = (baseString, ...args) => print(chalk.red("Error:"), format(baseString, ...args));

let processInput = () => {
	history.push(input);
	historyPos++;
	let inputs = input.join('').split(' ')
	let commandName = inputs.shift();
	let command = commands[commandName];
	input = [];
	cursorPos = input.length;
	try {
		if (command) return print(command(client, ...inputs));
		let output = eval(`${commandName} ${inputs.join(" ")}`);
		if (output instanceof Object) return print(format("%o", output))
		print(output)
	} catch (err) {
		error(err.stack)
	}
}

let printPrompt = () => {
	stdout.write(`${chalk.green(customPrompt)}${input.join('')}`);
	stdout.cursorTo(customPrompt.length + cursorPos)
}

stdin.on('keypress', (chunk, key) => {
	if (key.sequence == '\u0003') stdout.write('\n') && process.exit(0);
	else if (key.name == 'return') return stdout.write('\n') && processInput();
	else if (key.name == 'backspace') {
		if (input.length > 0 && cursorPos > 0) {
			input.splice(--cursorPos, 1)
		}
	}
	else if (key.name == 'delete') {
		if (input.length > 0 && cursorPos >= 0) {
			input.splice(cursorPos, 1)
		}
	}
	else if (key.name == 'left' && cursorPos > 0) cursorPos--;
	else if (key.name == 'right' && cursorPos + 1 < input.length + 1) ++cursorPos;
	else if (key.name == 'up' && historyPos > 0) {
		input = history[--historyPos]
		cursorPos = input.length
	}
	else if (key.name == 'down') {
		if (historyPos + 1 < history.length) {
			input = history[++historyPos]
		} else {
			input = []
			historyPos = history.length
		}
		cursorPos = input.length
	}
	else if (key.name == 'home') cursorPos = 0;
	else if (key.name == 'end') cursorPos = input.length;
	else if (key.sequence == '\u0017' || key.sequence == '\u0004') {
		input = input.slice(0, input.lastIndexOf(' ') == -1 ? 0 : input.lastIndexOf(' '));
		cursorPos = input.length;
	}
	else if (acceptableChars.includes(key.sequence)) {
		input.splice(cursorPos, 0, chunk)
		cursorPos++;
	}
	stdout.cursorTo(0)
	stdout.clearLine(0)
	printPrompt()
})

start();
module.exports = logger = {
	print,
	log,
	web,
	error,
	commands,
	customPrompt
}