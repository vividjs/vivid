import CACHE from './cache';
import {regexEscape as e, hashCode} from './utils';
const JTML_SPACE = '__JTML-SPACE__';

let blockOpen = '{%';
let blockClose = '%}';
let outputOpen = '{{';
let outputClose = '}}';

let r1 = null;
let r2 = null;
let r3 = null;
let r4 = null;
let r5 = null;

generateRegex();

function generateRegex() {
	r1 = new RegExp(`(?:${e(outputOpen)}(.*?)${e(outputClose)})|(?:${e(blockOpen)}(.*?)${e(blockClose)})`, 'g');
	r2 = new RegExp(`${e(outputOpen)}([\\w!]+) +(.+?) *;* *${e(outputClose)}`, 'g');
	r3 = new RegExp(`${e(outputOpen)} *(.+?) *;* *${e(outputClose)}`, 'g');
	r4 = new RegExp(`${e(blockOpen)}`, 'g');
	r5 = new RegExp(`${e(blockClose)}`, 'g');
}

function customHelper(...replaceMatch) {
	let command = replaceMatch[1];
	let args = replaceMatch[2]
		.trim()
		.replace(/([`'"]).*?[^\\]\1/g, m => m.replace(/\s/g, JTML_SPACE))
		.split(/\s+/)
		.map(arg => arg.replace(new RegExp(JTML_SPACE, 'g'), ' '));

	return {command, args};
}

function setLineNumbers(jtml) {
	return jtml
		.split(/\n/)
		.map((line, i) => `${blockOpen} LINE(${i}); ${blockClose}${line}`)
		.join(' ');
}


export function compile(jtml) {
	let hash = hashCode(jtml);

	// if this template exists in cache, use that instead
	let preparedTemplate = CACHE.CACHE[hash];

	if (preparedTemplate) {
		return preparedTemplate;
	}

	let functionContent = `
		var errorLineNumber;
		try {
			var LINE = function (number) { errorLineNumber = number };
			var p = [];
			with (obj) {
			p.push('${

		setLineNumbers(jtml)
			.replace(/[\r\t]/g, ' ')
			// .replace(/'(?![^{]*})/g, `\\'`)

			// Escape all '
			.replace(/'/g, `\\'`)

			// Un-escape all ' inside of statements
			.replace(r1, match => match.replace(/\\'/g, `'`))

			// Discover helpers
			.replace(r2, (...args) => {
				let helperData = customHelper(...args);
				return `', HELPERS.fn['${helperData.command}'](${helperData.args.join(', ')}), '`;
			})

			// Parse output syntax
			.replace(r3, `', UTILS.encodeHtml($1), '`)

			// Parse opening code snippet
			.replace(r4, `');\n`)

			// Parse closing code snippet
			.replace(r5, `\np.push('`)
		}');\n}
			return p.join('')
		} catch(e) {
			e = 'JTML error, line ' + errorLineNumber + ': ' + e;
			console.error(e);
			return e;
		}`;

	preparedTemplate = new Function('obj', 'UTILS', 'HELPERS', functionContent);
	CACHE.CACHE[hash] = preparedTemplate;
	// CACHE.deepCache(hash, functionContent);
	return preparedTemplate;
}

export function changeSyntax(syntaxObject) {
	blockOpen = syntaxObject.block[0];
	blockClose = syntaxObject.block[1];
	outputOpen = syntaxObject.output[0];
	outputClose = syntaxObject.output[1];
	generateRegex();
}

export default {
	compile,
	changeSyntax
}
