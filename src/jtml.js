import Compiler from './compiler';
import Render from './render';
import Templates from './templates';
import Cache from './cache';
import Helpers from './helpers';

class JTML {
	static compile(possibleSelectorOrHTMLOrDomNode) {

		let templateContent = Templates.getTemplateContent(possibleSelectorOrHTMLOrDomNode);

		let compiledTemplate = Compiler.compile(templateContent);

		return new Render(compiledTemplate);
	}

	static clearCache() {
		Cache.clearCache();
	}

	static registerHelper(...args) {
		Helpers.registerHelper(...args);
	}

	static config() {
		console.log('TODO');
	}
}

export default JTML;
