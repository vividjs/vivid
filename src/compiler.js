import CACHE from './cache';
import {BLOCKS} from './blocks';
import {regexEscape as e, hashCode} from './utils';

const JTML_SPACE = '__JTML-SPACE__';
const SPACE_REGEX = new RegExp(JTML_SPACE, 'g');
const NEW_LINES = /[\n\r\t]/g;
const APOS = /'/g;
const ESCAPOS = /\\'/g;
const HELPER = /!\*=\w+ .+\*!/;

const r1 = new RegExp(`(?:!\\*(.*?)\\*!)`, 'g');
const r2 = new RegExp(`!\\*=([\\w!]+) +(.+?) *;* *\\*!`, 'g');
const r3 = new RegExp(`!\\*= *(.+?) *;* *\\*!`, 'g');
const r4 = new RegExp(`!\\*`, 'g');
const r5 = new RegExp(`\\*!`, 'g');


function customHelper(...replaceMatch) {
	let command = replaceMatch[1];
	let args = replaceMatch[2]
		.trim()
		.replace(/([`'"]).*?[^\\]\1/g, m => m.replace(/\s/g, JTML_SPACE))
		.split(/\s+/)
		.map(arg => arg.replace(SPACE_REGEX, ' '));

	return {command, args};
}


export function compile(jtml) {

	if (CACHE.CACHE[jtml]) {
		return CACHE.CACHE[jtml];
	}

	let replaced = jtml.replace(NEW_LINES, ' ');

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

	// Escape all '
	if (replaced.indexOf(`'`) > -1) {
		replaced = replaced
			.replace(APOS, `\\'`)
			.replace(r1, match => match.replace(ESCAPOS, `'`))
	}

	if (HELPER.test(replaced)) {
		replaced = replaced.replace(r2, (...args) => {
			let helperData = customHelper(...args);
			return `', HELPERS.fn['${helperData.command}'](${helperData.args.join(', ')}), '`;
		});
	}

	// Parse output syntax
	replaced = replaced.replace(r3, `', UTILS.encodeHtml($1), '`);

	// Parse opening code snippet
	replaced = replaced.replace(r4, `');`);

	// Parse closing code snippet
	replaced = replaced.replace(r5, `p.push('`);


	let functionContent = `var p = [];p.push('${replaced}');\nreturn p.join('')`;

	let func = new Function('UTILS', 'HELPERS', functionContent);
	CACHE.CACHE[jtml] = func;
	return func;
}


export default {
	compile,
}
