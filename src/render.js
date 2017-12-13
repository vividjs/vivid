import fragment from 'html-fragment';
import UTILS from './utils';
import HELPERS from './helpers';
import {makeEvent} from './events';
import LOGGER from './logger';

export default class Render {
	constructor(func) {
		this._func = func;
		this._func.events = [];
		this._html = '';
		this._fragment = null;
	}

	render(data) {
		this._html = this._func.call(data, UTILS, HELPERS, makeEvent.bind(this._func));
		return this;
	}

	html(selectorOrNode) {
		let element = UTILS.getElement(selectorOrNode);

		if (!element) {
			throw Error(LOGGER.errors.invalidDomNodeOrSelector);
		}

		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}

		let frag = fragment(this._html);

		let eventElements = Array.from(frag.querySelectorAll('[vivid-event]'));

		for (let i = 0; i < eventElements.length; i++) {
			let el = eventElements[i];
			let eventData = el.getAttribute('vivid-event').split(':');
			el.addEventListener(eventData[0], this._func.events[eventData[1]]);
			el.removeAttribute('vivid-event');
		}

		element.appendChild(frag);

		return this;
	}
}
