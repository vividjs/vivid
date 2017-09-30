import fragment from 'html-fragment';
import UTILS from './utils';
import HELPERS from './helpers';
import LOGGER from './logger';

export default class Render {
	constructor(func) {
		this._func = func;
		this._html = '';
		this._fragment = null;
	}

	render(data) {
		this._html = this._func.call(data, UTILS, HELPERS);
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
		element.appendChild(fragment(this._html));

		return this;
	}
}
