/* global test expect */
import fn from '../index.js';

test('title', () => {
	expect(() => fn()).toThrow('expected a string, got undefined');
	expect(fn('unicorns')).toBe('unicorns & rainbows');
});
