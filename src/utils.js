export function regexEscape(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function isDOM(obj) {
	if ("HTMLElement" in window) {
		return (obj && obj instanceof HTMLElement);
	}
	return !!(obj && typeof obj === "object" && obj.nodeType === 1 && obj.nodeName);
}

export function fragmentFromString(strHTML) {
	return document.createRange().createContextualFragment(strHTML);
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

export default {
	regexEscape,
	isDOM,
	fragmentFromString,
	encodeHtml,
	hashCode
};
