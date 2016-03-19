'use strict';
<% if (updateNotifier) { %>
var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
updateNotifier({pkg}).notify();
<% } %>

module.exports = function (str, opts) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	opts = opts || {};

	return str + ' & ' + (opts.postfix || 'rainbows');
};
