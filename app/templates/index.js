<% if (updateNotifier) { %>
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
updateNotifier({pkg}).notify();
<% } %>

export default function temporaryFunction(str, {postfix = 'rainbows'} = {}) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return `${input} & ${postfix}`;
};
