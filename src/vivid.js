import './polyfills/Array.from';
import Compiler from './compiler';
import Render from './render';
import Templates from './templates';
import Cache from './cache';
import Helpers from './helpers';
import Blocks from './blocks';
import {syntax} from './config';

class Vivid {
	static compile(possibleSelectorOrHTMLOrDomNode) {

		let templateContent = Templates.getTemplateContent(possibleSelectorOrHTMLOrDomNode);

		let compiledTemplate = Compiler.compile(templateContent);

		let render = Render.bind(null, compiledTemplate);

		return {render};
	}

	static clearCache() {
		Cache.clearCache();
	}

	static registerHelper(...args) {
		Helpers.registerHelper(...args);
	}

	static get helpers() {
		return Helpers.fn;
	}

	static registerBlock(...args) {
		Blocks.registerBlock(...args);
	}

	static get blocks() {
		return Blocks.fn;
	}

	static config(options = {}) {
	}

	static setSyntax(newSyntax = {}) {
		Object.assign(syntax, newSyntax);
		Compiler.createSyntaxRegex();
	}
}

export default Vivid;
