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

function encodeHtml(input) {
	// Even though we're adding some more regex, this simple regex allows this function to be more efficient
	// on large data sets
	if (/[<>'"&]/.test(input)) {
		// This method is faster instead of creating text nodes
		return String(input)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	return input;
}

export default {
	regexEscape,
	isDOM,
	fragmentFromString,
	encodeHtml
};
