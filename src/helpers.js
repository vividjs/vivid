export let HELPERS = {
	raw: output => output,

	use: (id, data) => window.jtml.compile(id).render(data).html,
};


export function registerHelper(name, fn) {
	HELPERS[name] = fn;
}


export default {
	fn: HELPERS,
	registerHelper
}
