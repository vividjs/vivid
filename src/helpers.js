import {encodeHtml} from './utils';

export let HELPERS = {
	raw: output => output,
};


export function registerHelper(name, fn, safe = true) {
	HELPERS[name] = (!safe) ? fn : (...args) => encodeHtml(fn(...args));
}


export default {
	fn: HELPERS,
	registerHelper
}
