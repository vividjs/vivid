export function regexEscape(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function encodeHtml(input) {
	if (/[&"'<>]/i.test(input)) {
		return document.createElement('a').appendChild(
			document.createTextNode(input)
		).parentNode.innerHTML;
	}
	return input;
}

export function hashCode(str) {
	let hash = 0;
	let i = 0;
	let chr;
	let len = str.length;

	for (i; i < len; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}

	return hash
}

export function getElement(selectorOrNode) {
	if (selectorOrNode instanceof HTMLElement) {
		return selectorOrNode;
	}
	else {
		let element = document.querySelector(selectorOrNode);
		if (element) {
			return element;
		}
	}

	return null;
}

export function getQueryParams(url = document.location) {
	const a = document.createElement('a');
	a.href = url;
	if (!a.search.length) {
		return {}
	}
	return a.search
		.replace(/^\?/, '')
		.split('&')
		.reduce((obj, item) => {
			let split = item.split('=');
			obj[split[0]] = split[1];
			return obj;
		}, {});
}

export default {
	regexEscape,
	encodeHtml,
	hashCode,
	getElement,
};
