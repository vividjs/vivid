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

export default {
	regexEscape,
	isDOM,
	fragmentFromString,
	encodeHtml
};
