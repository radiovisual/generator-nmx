/* global test */
const path = require('node:path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

const PLUGIN_GENERATOR_PATH = path.join(__dirname, 'app', 'index.js');

test('generates expected files', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'test',
			githubUsername: 'test',
			website: 'test.com',
			cli: false,
			babel: false,
			codecov: false,
			updateNotifier: false,
		});

	assert.file([
		'.editorconfig',
		'.git',
		'.gitattributes',
		'.gitignore',
		'.npmrc',
		'index.js',
		'license',
		'package.json',
		'readme.md',
		'__tests__/test.js',
		'.github/workflows/main.yml',
	]);

	assert.noFile('cli.js');
	assert.noFile('lib/index.js');
});

test('CLI option', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'test',
			githubUsername: 'test',
			website: 'test.com',
			cli: true,
			babel: false,
			codecov: false,
			updateNotifier: false,
		});

	assert.file('cli.js');
	assert.fileContent('package.json', /"bin":/);
	assert.fileContent('package.json', /"bin": "cli.js"/);
	assert.fileContent('package.json', /"meow"/);
	assert.noFileContent('package.json', /"update-notifier": "+/);
});

test('prompts for description', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'test',
			moduleDescription: 'foo',
			githubUsername: 'test',
			website: 'test.com',
			cli: false,
			nyc: true,
			codecov: true,
		});

	assert.fileContent('package.json', /"description": "foo",/);
	assert.fileContent('readme.md', /> foo/);
});

test('defaults to superb description', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'test',
			githubUsername: 'test',
			website: 'test.com',
			cli: false,
			nyc: true,
			codecov: true,
		});

	assert.fileContent('package.json', /"description": "My .+ module",/);
	assert.fileContent('readme.md', /> My .+ module/);
});

test('babel option', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'test',
			githubUsername: 'test',
			website: 'test.com',
			cli: false,
			babel: true,
			codecov: false,
			updateNotifier: false,
		});

	assert.file('lib/index.js');
	assert.fileContent('package.json', /"babel-runtime": "+/);
	assert.fileContent('package.json', /"babel": "+/);
	assert.fileContent('package.json', /"test": "xo && npm run build && jest"/);
	assert.fileContent(
		'package.json',
		/"build": "babel lib --out-dir=dist --optional=runtime"/,
	);
	assert.fileContent('.gitignore', /dist/);
	assert.fileContent(
		'package.json',
		/"xo": {[\r\n\s]*"esnext": true,[\r\n\s]*"ignores": \[[\r\n\s]*"dist\/\*\*"/g,
	);
	assert.noFileContent('package.json', /"update-notifier": "+/);
	assert.noFile('index.js');
});

test('codecov option', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'foo',
			githubUsername: 'radiovisual',
			website: 'test.com',
			cli: false,
			babel: false,
			codecov: true,
			updateNotifier: false,
		});

	assert.fileContent('package.json', /"codecov": "+/);
	assert.fileContent('package.json', /"collectCoverage": true/);
	assert.fileContent('readme.md', '[![codecov](https://codecov.io/gh');
});

test('no codecoverage option', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'foo',
			githubUsername: 'radiovisual',
			website: 'test.com',
			cli: false,
			babel: false,
			codecov: false,
			updateNotifier: false,
		});

	assert.noFileContent('package.json', /"codecov": "+/);
	assert.noFileContent('package.json', /"collectCoverage": true/);
	assert.noFileContent('readme.md', '[![codecov](https://codecov.io/gh');
});

test('update notifier option', async () => {
	await helpers
		.run(PLUGIN_GENERATOR_PATH)
		.withOptions({'skip-install': true})
		.withPrompts({
			moduleName: 'test',
			githubUsername: 'test',
			website: 'test.com',
			cli: false,
			babel: false,
			codecov: true,
			updateNotifier: true,
		});

	assert.fileContent('package.json', /"update-notifier": "+/);
	assert.fileContent(
		'index.js',
		/const updateNotifier = require\('update-notifier'\)/,
	);
	assert.fileContent('index.js', /const pkg = require\('\.\/package\.json'\)/);
	assert.fileContent('index.js', /updateNotifier\({pkg}\)\.notify\(\)/);
});
