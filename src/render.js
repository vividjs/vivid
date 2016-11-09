import UTILS from './utils';
import HELPERS from './helpers';

export default class Render {
	constructor(func) {
		this.func = func;
		this.html = '';
	}

	render(data) {
		this.html = this.func(data, UTILS, HELPERS);
		return this;
	}

	appendTo(selectorOrNode) {
		let fragment = UTILS.fragmentFromString(this.html);

		if (UTILS.isDOM(selectorOrNode)) {
			selectorOrNode.appendChild(fragment);
		}
		else {
			let element = document.querySelector(selectorOrNode);
			if (element) {
				element.appendChild(fragment);
			}
		}

		// document.querySelector(selectorOrNode).innerHTML = this.html;

		return this;
	}
}
