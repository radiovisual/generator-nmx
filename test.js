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
			codecov: false,
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
			codecov: false,
		});

	assert.file('cli.js');
	assert.fileContent('package.json', /"bin":/);
	assert.fileContent('package.json', /"bin": "cli.js"/);
	assert.fileContent('package.json', /"meow"/);
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
		});

	assert.fileContent('jest.config.js', /collectCoverage: true/);
	assert.fileContent('readme.md', '[![codecov](https://codecov.io/gh');
	assert.fileContent(
		'.github/workflows/main.yml',
		'uses: codecov/codecov-action@v4',
	);
	assert.fileContent('.github/workflows/main.yml', 'secrets.CODECOV_TOKEN');
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
		});

	assert.fileContent('jest.config.js', /collectCoverage: false/);
	assert.noFileContent('readme.md', '[![codecov](https://codecov.io/gh');
	assert.noFileContent(
		'.github/workflows/main.yml',
		'uses: codecov/codecov-action@v4',
	);
	assert.noFileContent('.github/workflows/main.yml', 'secrets.CODECOV_TOKEN');
});
