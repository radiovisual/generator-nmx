export default function (str, opts) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	opts = opts || {};
	opts.postfix = opts.postfix || 'rainbows';

	return `${str} & ${opts.postfix}`;
}

