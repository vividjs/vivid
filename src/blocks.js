export let BLOCKS = {
	each(key, discard, object) {
		return `{% ${object}.forEach(function (${key}) { %}`;
	},
	endeach() {
		return `{% }); %}`
	},
	if(...args) {
		return `{% if (${args.join(' ')}) { %}`;
	},
	elseif(...args) {
		return `{% } else if (${args.join(' ')}) { %}`;
	},
	else() {
		return `{% } else { %}`;
	},
	endif() {
		return `{% } %}`;
	}
};


export function registerBlock(name, fn) {
	BLOCKS[name] = fn;
}


export default {
	fn: BLOCKS,
	registerBlock
}
