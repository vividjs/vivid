import fragment from 'html-fragment';
import UTILS from './utils';
import HELPERS from './helpers';
import {makeEvent} from './events';
import LOGGER from './logger';

export default function (func, selectorOrNode, data) {
	let element = UTILS.getElement(selectorOrNode);

	if (!element) {
		throw Error(LOGGER.errors.invalidDomNodeOrSelector);
	}

	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}

	func.events = [];
	let html = func.call(data, UTILS, HELPERS, makeEvent.bind(func));
	let frag = fragment(html);
	let eventElements = Array.from(frag.querySelectorAll('[vivid-event]'));

	for (let i = 0; i < eventElements.length; i++) {
		let el = eventElements[i];
		let eventData = el.getAttribute('vivid-event').split(':');
		el.addEventListener(eventData[0], func.events[eventData[1]]);
		el.removeAttribute('vivid-event');
	}

	element.appendChild(frag);
}
