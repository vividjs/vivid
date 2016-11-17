const localStorageKey = '__JTML_CACHED_TEMPLATES__';

let CACHE = {};

let storedTemplates = JSON.parse(localStorage.getItem(localStorageKey));
let DEEP_CACHE = storedTemplates || {};

if (storedTemplates) {
	Object.keys(storedTemplates).forEach(hash => {
		CACHE[hash] = new Function('obj', 'UTILS', 'HELPERS', storedTemplates[hash]);
	});
}

function deepCache(hash, functionContent) {
	DEEP_CACHE[hash] = functionContent;

	window.setTimeout(function () {
		localStorage.setItem(localStorageKey, JSON.stringify(DEEP_CACHE));
	}, 0);
}

function clearCache() {
	Object.keys(CACHE).forEach(key => delete CACHE[key]);
	localStorage.removeItem(localStorageKey);
}

export default {
	CACHE,
	deepCache,
	clearCache
};
