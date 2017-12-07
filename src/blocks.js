import {syntax} from './config';
const open = syntax.openingStatement;
const close = syntax.openingStatement;

export let BLOCKS = {
	each(key, discard, object) {
		return `${open} ${object}.forEach(function (${key}) { ${close}`;
	},
	endeach() {
		return `${open} ); ${close}`
	},
	if(...args) {
		return `${open} if (${args.join(' ')}) { ${close}`;
	},
	elseif(...args) {
		return `${open} } else if (${args.join(' ')}) { ${close}`;
	},
	else() {
		return `${open} } else { ${close}`;
	},
	endif() {
		return `${open} } ${close}`;
	}
};


export function registerBlock(name, fn) {
	BLOCKS[name] = fn;
}


export default {
	fn: BLOCKS,
	registerBlock
}
