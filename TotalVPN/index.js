const fs = require('fs');

function ShiftText(text,shift){
	return text.split('').map((char)=>{
		if(char.match(/[a-z]/i)){
			const code=char.charCodeAt(0);
			const offset=code>=65&&code<=90?65:97;
			return String.fromCharCode(((code-offset-shift+26)%26)+offset);
		}
		return char;
	}).join('')
}

const MAIN_URL = 'https://katnmv.github.io/exs/list.json'; // Main URL
const DEFAULT_SHIFT = 3;
const PROXIES_VARIABLE = 's';

async function getProxies() {
    const response = await fetch(MAIN_URL).then(e => e.text());
    const decoded = ShiftText(response, DEFAULT_SHIFT);
    const json = JSON.parse(decoded);

	console.log('Recieved',json[PROXIES_VARIABLE].length,'proxies.')

    fs.writeFileSync('proxies.txt', json[PROXIES_VARIABLE].map(x => {
		const [ PROXY ] = atob(x).split('|');
		const [ HOST, PORT, USER, PASS ] = PROXY.split(':');
		return `${USER}:${PASS}@${HOST}:${PORT}`;
	}).join('\n'))
}

try {
	getProxies();
} catch {
	console.log('Something went wrong. Please create an issue on GITHUB, and provide the service name')
}