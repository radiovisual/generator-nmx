import fn from '../<% if (babel) { %>dist/<% } %>';

test('title', () => {
	expect(fn('unicorns')).toBe('unicorns & rainbows');
});
