module.exports = {
	name: 'rovarsproket',
	aliases: ['rs', 'rovar', 'rövarspråket', 'rövar'],
	description: 'Returns your given string in roversproket.',
	args: true,
	execute(message, args) {
		let input = args.join(' ').split("");
		const consonants = 'B C D F G H J K L M N P Q R S T V X Z W Y'.split(" ");
		let toPrint = "";
		input.forEach(char => {
			if (consonants.includes(char.toUpperCase())) {
				toPrint += `${char}o${char}`;
			} else {
				toPrint += char
			}
		})
		message.reply(toPrint)
	}
}