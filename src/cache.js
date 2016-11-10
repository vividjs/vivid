const localStorageKey = '__JTML_CACHED_TEMPLATES__';

let CACHE = {};

let storedTemplates = JSON.parse(localStorage.getItem(localStorageKey));
let DEEP_CACHE = storedTemplates || {};

if (storedTemplates) {
	Object.keys(storedTemplates).forEach(jtml => {
		CACHE[jtml] = new Function('obj', 'UTILS', 'HELPERS', storedTemplates[jtml]);
	});
}

function deepCache(jtml, functionContent) {

	DEEP_CACHE[jtml] = functionContent;

	window.setTimeout(function () {
		localStorage.setItem(localStorageKey, JSON.stringify(DEEP_CACHE));
	}, 0);
}

function clearCache() {
	localStorage.removeItem(localStorageKey);
}

export default {
	CACHE,
	deepCache,
	clearCache
};
