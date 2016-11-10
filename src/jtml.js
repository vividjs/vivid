import Compiler from './compiler';
import Render from './render';
import Templates from './templates';
import Cache from './cache';

class JTML {
	static compile(possibleSelectorOrHTMLOrDomNode) {

		let templateContent = Templates.getTemplateContent(possibleSelectorOrHTMLOrDomNode);

		let compiledTemplate = Compiler.compile(templateContent);

		return new Render(compiledTemplate);
	}

	static clearCache() {
		Cache.clearCache();
	}

	static registerHelper() {
		console.log('TODO');
	}

	static config() {
		console.log('TODO');
	}
}

export default JTML;
