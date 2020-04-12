module.exports = {
	'\u0003': stdout.write('\n') && process.exit(0),
	'return': stdout.write('\n') && processInput(), 
	else if(key.name == 'backspace') {
	if (input.length > 0 && cursorPos > 0) {
		input.splice(--cursorPos, 1)
	}
}
	else if (key.name == 'delete') {
	if (input.length > 0 && cursorPos >= 0) {
		input.splice(cursorPos, 1)
	}
}
else if (key.name == 'left') {
	if (cursorPos > 0) {
		cursorPos--;
	}
} else if (key.name == 'right' && cursorPos + 1 < input.length) ++cursorPos;
else if (key.name == 'up' && historyPos > 0) {
	input = history[--historyPos]
	cursorPos = input.length
}
else if (key.name == 'down' && historyPos + 1 < history.length) {
	input = history[++historyPos]
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
}