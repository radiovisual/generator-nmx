export default function temporaryFunction(input, { postfix = 'rainbows' } = {}) {
	if (typeof input !== 'string') {
		throw new TypeError(`expected a string, got ${typeof input}`);
	}
	return `${input} & ${postfix}`;
}
