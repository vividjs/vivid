import CACHE from './cache';
import {BLOCKS} from './blocks';

const JTML_SPACE = '__JTML-SPACE__';

/* Compiler Regular Expressions */
const R_SPACE = new RegExp(JTML_SPACE, 'g');
const R_NEW_LINES = /[\n\r\t]/g;
const R_APOSTROPHE = /'/g;
const R_ESC_APOSTROPHE = /\\'/g;
const R_HELPER = /!\*=\w+ .+\*!/;
/* Syntax Resolving Regular Expressions */
const R_ALL_CODE = new RegExp(`(?:!\\*(.*?)\\*!)`, 'g');
const R_CUSTOM_HELPER = new RegExp(`!\\*=([\\w!]+) +(.+?) *;* *\\*!`, 'g');
const R_OUTPUT_BLOCK = new RegExp(`!\\*= *(.+?) *;* *\\*!`, 'g');
const R_OPENING_SYNTAX = new RegExp(`!\\*`, 'g');
const R_CLOSING_SYNTAX = new RegExp(`\\*!`, 'g');


function customHelper(...replaceMatch) {
	let command = replaceMatch[1];
	let args = replaceMatch[2]
		.trim()
		.replace(/([`'"]).*?[^\\]\1/g, m => m.replace(/\s/g, JTML_SPACE))
		.split(/\s+/)
		.map(arg => arg.replace(R_SPACE, ' '));

	return {command, args};
}


export function compile(jtml) {

	if (CACHE.CACHE[jtml]) {
		return CACHE.CACHE[jtml];
	}

	// Toss all new lines
	let replaced = jtml.replace(R_NEW_LINES, ' ');

	// Look for custom blocks and replace with regular code
	if (replaced.indexOf('!#') > -1) {
		replaced = replaced
			.replace(/!#(.*?)#!/g, (c, m) => {
				let details = m.trim().split(/\s+/);
				if (!BLOCKS[details[0]]) {
					throw new Error(`An unknown block helper was used: ${details[0]}`);
				}
				return BLOCKS[details[0]](...details.splice(1));
			})
	}

	// Escape all ' inside of code blocks
	if (replaced.indexOf(`'`) > -1) {
		replaced = replaced
			.replace(R_APOSTROPHE, `\\'`)
			.replace(R_ALL_CODE, match => match.replace(R_ESC_APOSTROPHE, `'`));
	}

	// Look for custom helpers
	if (R_HELPER.test(replaced)) {
		replaced = replaced.replace(R_CUSTOM_HELPER, (...args) => {
			let helperData = customHelper(...args);
			return `', HELPERS.fn['${helperData.command}'](${helperData.args.join(', ')}), '`;
		});
	}

	// Parse output syntax
	replaced = replaced.replace(R_OUTPUT_BLOCK, `', UTILS.encodeHtml($1), '`);

	// Parse opening code snippet
	replaced = replaced.replace(R_OPENING_SYNTAX, `');`);

	// Parse closing code snippet
	replaced = replaced.replace(R_CLOSING_SYNTAX, `p.push('`);


	let functionContent = `var p = [];p.push('${replaced}');\nreturn p.join('')`;
	let func = new Function('UTILS', 'HELPERS', functionContent);
	CACHE.CACHE[jtml] = func;
	return func;
}


export default {
	compile,
}
