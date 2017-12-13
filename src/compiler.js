import CACHE from './cache';
import {BLOCKS} from './blocks';
import {syntax} from "./config";
import {regexEscape} from "./utils";

const VIVID_SPACE = '__VIVID-SPACE__';

/* Compiler Regular Expressions */
const R_SPACE = new RegExp(VIVID_SPACE, 'g');
const R_NEW_LINES = /[\n\r\t]/g;
const R_APOSTROPHE = /'/g;
const R_ESC_APOSTROPHE = /\\'/g;
const R_MULTIPLE_WHITESPACE = /\s+/;
const R_HELPER_STRINGS = /([`'"]).*?[^\\]\1/g;
const R_EVENT_CHECK = /v-[a-z]+="/g;
const R_EVENT_REPLACE = /v-([a-z]+)="(.*?)"/g;
/* Syntax Resolving Regular Expressions */
let R_HELPER,
	R_ALL_CODE,
	R_CUSTOM_HELPER,
	R_OUTPUT_BLOCK,
	R_OPENING_SYNTAX,
	R_CLOSING_SYNTAX,
	R_CUSTOM_BLOCK;

createSyntaxRegex();

function customHelper(...replaceMatch) {
	let command = replaceMatch[1];
	let args = replaceMatch[2]
		.trim()
		.replace(R_HELPER_STRINGS, m => m.replace(/\s/g, VIVID_SPACE))
		.split(R_MULTIPLE_WHITESPACE)
		.map(arg => arg.replace(R_SPACE, ' '));

	return {command, args};
}

export function createSyntaxRegex() {
	let e = Object.assign({}, syntax);
	Object.keys(e).forEach(key => e[key] = regexEscape(e[key]));

	R_HELPER = new RegExp(`${e.openingOutput}\\w+ .+${e.closingOutput}`);
	let betweenStatements = `(?:${e.openingStatement}(.*?)${e.closingStatement})`;
	let betweenOutputs = `(?:${e.openingOutput}(.*?)${e.closingOutput})`;
	let betweenBlocks = `(?:${e.openingBlockHelper}(.*?)${e.closingBlockHelper})`;
	R_ALL_CODE = new RegExp([betweenStatements, betweenOutputs, betweenBlocks].join('|'), 'g');
	R_CUSTOM_HELPER = new RegExp(`${e.openingOutput}([\\w]+) +(.+?) *;* *${e.closingOutput}`, 'g');
	R_OUTPUT_BLOCK = new RegExp(`${e.openingOutput} *(.+?) *;* *${e.closingOutput}`, 'g');
	R_OPENING_SYNTAX = new RegExp(`${e.openingStatement}`, 'g');
	R_CLOSING_SYNTAX = new RegExp(`${e.closingStatement}`, 'g');
	R_CUSTOM_BLOCK = new RegExp(`${e.openingBlockHelper}(.*?)${e.closingBlockHelper}`, 'g');
}


export function compile(template) {

	if (CACHE.CACHE[template]) {
		return CACHE.CACHE[template];
	}

	// Toss all new lines
	let replaced = template.replace(R_NEW_LINES, ' ');

	// look for events
	if (R_EVENT_CHECK.test(replaced)) {
		replaced = replaced.replace(R_EVENT_REPLACE, (c, type, callback) => {
			return `${syntax.openingOutput} EVENT('${type}',function($event){${callback}}.bind(this)); ${syntax.closingOutput}`;
		});
	}

	// Look for custom blocks and replace with regular code
	if (replaced.indexOf(syntax.openingBlockHelper) > -1) {
		replaced = replaced
			.replace(R_CUSTOM_BLOCK, (c, m) => {
				let details = m.trim().split(R_MULTIPLE_WHITESPACE);
				if (!BLOCKS[details[0]]) {
					throw new Error(`An unknown block helper was used: ${details[0]}`);
				}
				return BLOCKS[details[0]](...details.splice(1));
			})
	}

	// Escape all ' outside of code blocks
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


	let functionContent = `var p = [];p.push('${replaced}');\nreturn p.join('');`;
	let func = new Function('UTILS', 'HELPERS', 'EVENT', functionContent);
	CACHE.CACHE[template] = func;
	return func;
}


export default {
	createSyntaxRegex,
	compile,
}
