import {encodeHtml} from './utils';

export let HELPERS = {
	raw: output => output,
	dump: output => `<pre>${JSON.stringify(output, null, 2)}</pre>`
};


export function registerHelper(name, fn, safe = true) {
	HELPERS[name] = (!safe) ? fn : (...args) => encodeHtml(fn(...args));
}


export default {
	fn: HELPERS,
	registerHelper
}
