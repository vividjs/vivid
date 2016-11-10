import UTILS from './utils';
import HELPERS from './helpers';

const eventAttributeName = 'jtml-event';

export default class Render {
	constructor(func) {
		this.func = func;
		this.html = '';
	}

	render(data, events) {
		this.html = this.func(data, UTILS, HELPERS);
		this.fragment = UTILS.fragmentFromString(this.html);

		Array.from(this.fragment.querySelectorAll(`[${eventAttributeName}]`))
			.forEach(el => {

				if (events) {
					el.getAttribute('jtml-event').replace(/\[(.*?)]\((.*?)\)/g, (...args) => {
						let eventType = args[1];
						let handlers = args[2].trim().split(/\s+/);

						handlers.forEach(handlers => {
							el.addEventListener(eventType, events[handlers]);
						});
					});
				}

				el.removeAttribute(eventAttributeName);
			});

		return this;
	}

	appendTo(selectorOrNode) {
		if (UTILS.isDOM(selectorOrNode)) {
			selectorOrNode.appendChild(this.fragment);
		}
		else {
			let element = document.querySelector(selectorOrNode);
			if (element) {
				element.appendChild(this.fragment);
			}
		}

		return this;
	}
}
