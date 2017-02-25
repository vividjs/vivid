import CACHE from './cache';
import {hashCode} from './utils';

const JTML_SPACE = '__JTML-SPACE__';

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
		.map((line, i) => `{% LINE(${i}); %}${line}`)
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
			.replace(/(?:{{(.*?)}})|(?:{%(.*?)%})/g, match => match.replace(/\\'/g, `'`))

			// Discover helpers
			.replace(/{{([\w!]+) +(.+?) *;* *}}/g, (...args) => {
				let helperData = customHelper(...args);
				return `', HELPERS.fn['${helperData.command}'](${helperData.args.join(', ')}), '`;
			})

			// Parse output syntax
			.replace(/{{ *(.+?) *;* *}}/g, `', UTILS.encodeHtml($1), '`)

			// Parse opening code snippet
			.replace(/{%/g, `');\n`)

			// Parse closing code snippet
			.replace(/%}/g, `\np.push('`)
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


export default {
	compile,
}
