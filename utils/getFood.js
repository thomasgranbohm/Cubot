const request = require('request');
const fs = require('fs');
const {
	ss
} = require('../config.json')

let options = {
	url: 'https://sms13.schoolsoft.se/nacka/jsp/Login.jsp',
	headers: {
		contentType: 'application/x-www-form-urlencoded',
		charset: 'iso-8859-1',
	},
	form: {
		ssusername: ss.username,
		sspassword: ss.password,
		action: "login",
		usertype: 1,
		button: "Logga in"
	},
};

request.post(options).on('response', (response) => {
	options = {
		url: 'https://sms13.schoolsoft.se/nacka/jsp/student/right_student_lunchmenu_print.jsp',
		headers: {
			contentType: 'application/x-www-form-urlencoded',
			charset: 'iso-8859-1',
			Cookie: `${response.headers['set-cookie'][0].split("; ")[0]};hash=okthisisepic;usertype=1`.replace(":", "="),
		},
		form: {
			action: "print",
			requestid: getWeekNumber(new Date()),
			dish: 3,
			button: "Skriv ut"
		},
		followAllRedirects: true,
		encoding: 'latin1'
	}
	request.post(options, (err, httpResponse, body) => {
		if (err) return console.error(err)
		let table = body.split('<table class="print" cellspacing="0" cellpadding="0" width="100%" border="1" ><tr><td class="printMedium" align="center" colspan="51" >')[1].split('</table')[0]
		let days = table.split('<td  class="printSmallBold" valign="top" align="center" width="16%">').map(obj => obj.split("</td")[0]).filter(obj => !(obj.includes("Vecka") || obj.includes("Lunch"))).slice(1)
		let lunches = table.split('<td valign="top" class="printSmall">').slice(1).map(obj => obj.split("</td")[0].replace(new RegExp("<br />", 'g'), " ").replace(/ +(?= )/g, ''))

		let toJSON = []
		days.forEach(d => toJSON.push({
			day: d,
			lunch: lunches[days.indexOf(d)].trim()
		}))
		fs.writeFile('/home/thomas/CuBot/utils/lunch.json', JSON.stringify(toJSON, null, 4), (err) => {
			if (err) console.error(err)
		})
	})
})

function getWeekNumber(d) {
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	return weekNo;
}