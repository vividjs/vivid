function removeWhiteSpaces(jtml) {
	return jtml
		.replace(/\r/g, ' ')
		.replace(/\n/g, ' ')
		.replace(/\t/g, ' ');
}

function addWhiteSpaces(jtml) {
	// return jtml
	// 	.replace(/__JTML-R__/g, ' ')
	// 	.replace(/__JTML-N__/g, ' ')
	// 	.replace(/__JTML-T__/g, ' ');
}

function customHelper(...replaceMatch) {
	// console.log('Landed in the custom helper');
	let command = replaceMatch[1];
	let customArgs = replaceMatch[2]
		.replace(/([`'"]).*?[^\\]\1/g, m => m.replace(/\s/g, '__JTML-SPACE__'))
		.split(/\s+/)
		.map(arg => arg.replace(/__JTML-SPACE__/g, ' '));

	// console.log(replaceMatch);
	// console.log('Command', command);
	// console.log('Args', customArgs);

	return `', HELPERS.fn['${command}'](${customArgs.join(', ')}), '`;
}

export default function compiler(jtml) {
	let functionContent = removeWhiteSpaces(jtml);

	functionContent = `var p = [];
		with (obj) {
		p.push('${
		functionContent
			.replace(/'(?![^{]*})/g, `\\'`)
			.replace(/{{(\w+) +(.+?) *;* *}}/g, customHelper)
			.replace(/{{ *(.+?);* *}}/g, `', UTILS.encodeHtml($1), '`)
			.replace(/{%/g, `');\n`)
			.replace(/%}/g, `\np.push('`)
		}');\n}
		return p.join('')`;

	// functionContent = functionContent
	// // 	Must preserve ' inside of expressions
	// 	.replace(/'(?![^{]*})/g, `\\'`)
	// 	.replace(/{{(\w+) +(.+?) *;* *}}/g, customHelper)
	// 	.replace(/{{ *(.+?);* *}}/g, "', $1, '");

	return new Function('obj', 'UTILS', 'HELPERS', functionContent);
}
