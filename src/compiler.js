import * as CACHE from './cache';

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


export function compile(jtml) {
	// if this template exists in cache, use that instead
	let preparedTemplate = CACHE.CACHE[jtml];

	if (preparedTemplate) {
		return preparedTemplate;
	}

	let functionContent = `var p = [];
		with (obj) {
		p.push('${
		jtml
			.replace(/[\r\n\t]/g, ' ')
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
		return p.join('')`;

	preparedTemplate = new Function('obj', 'UTILS', 'HELPERS', functionContent);
	CACHE.CACHE[jtml] = preparedTemplate;
	CACHE.deepCache(jtml, functionContent);
	return preparedTemplate;
}


export default {
	compile,
}
