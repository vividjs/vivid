import UTILS from './utils';

export function getTemplateContent(possibleSelectorOrHTMLOrNode) {
	if (possibleSelectorOrHTMLOrNode instanceof HTMLElement) {
		return possibleSelectorOrHTMLOrNode.innerHTML;
	}

	try {
		let element = document.querySelector(possibleSelectorOrHTMLOrNode);
		if (element) {
			return element.innerHTML;
		}
	} catch (e) {
	}

	// Hitting this return means that it is probably HTML
	return possibleSelectorOrHTMLOrNode;
}

export default {
	getTemplateContent
}
