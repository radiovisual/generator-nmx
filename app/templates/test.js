import test from 'ava';
import fn from './<% if (babel) { %>dist/<% } %>';

test('title', t => {
	t.is(fn('unicorns'), 'unicorns & rainbows');
});
