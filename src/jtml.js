import CACHE from './cache';
import UTILS from './utils';
import Compiler from './compiler';
import Render from './render';

function getTemplateContent(possibleSelectorOrHTMLOrNode) {
	if (UTILS.isDOM(possibleSelectorOrHTMLOrNode)) {
		return possibleSelectorOrHTMLOrNode.innerHTML;
	}

	if (typeof possibleSelectorOrHTMLOrNode == 'string' && possibleSelectorOrHTMLOrNode[0] == '#') {
		let element = document.querySelector(possibleSelectorOrHTMLOrNode);
		if (element) {
			return element.innerHTML;
		}
	}

	// Hitting this return means that it is probably HTML
	return possibleSelectorOrHTMLOrNode;
}

function JTML() {
}

JTML.compile = function (possibleSelectorOrHTMLOrNode) {
	let templateContent = getTemplateContent(possibleSelectorOrHTMLOrNode);

	let operationalFunction = CACHE[templateContent];

	if (!operationalFunction) {
		operationalFunction = Compiler(templateContent);
		CACHE[templateContent] = operationalFunction;
	}

	return new Render(operationalFunction);
};

export default JTML;
