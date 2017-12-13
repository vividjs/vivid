export function makeEvent(type, callback) {
	let count = this.events.push(callback);
	return `vivid-event="${type}:${count - 1}"`;
}
