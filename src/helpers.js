export let HELPERS = {
	raw: output => output,

	use: (id, data) => window.jtml.compile(id).render(data).html,

	rev: text => text.split('').reverse().join('')
};

export default {
	fn: HELPERS
}
