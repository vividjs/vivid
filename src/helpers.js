export let HELPERS = {
	raw: function (output) {
		return output;
	},
	use: function (id, data) {
		return window.jtml.compile(id).render(data).html;
	},
	rev: function (text) {
		return text.split('').reverse().join('');
	}
};

export default {
	fn: HELPERS
}
