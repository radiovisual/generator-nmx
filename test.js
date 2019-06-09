import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';

let generator;

test.beforeEach(async () => {
	await pify(helpers.testDirectory)(path.join(__dirname, 'temp'));
	generator = helpers.createGenerator('nmx:app', ['../app'], null, {skipInstall: true});
});

test.serial('generates expected files', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: false,
		babel: false,
		codecov: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.file([
		'.editorconfig',
		'.git',
		'.gitattributes',
		'.gitignore',
		'.travis.yml',
		'.npmrc',
		'index.js',
		'license',
		'package.json',
		'readme.md',
		'__tests__/test.js'
	]);

	assert.noFile('cli.js');
	assert.noFile('lib/index.js');
});

test.serial('CLI option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: true,
		babel: false,
		codecov: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.file('cli.js');
	assert.fileContent('package.json', /"bin":/);
	assert.fileContent('package.json', /"bin": "cli.js"/);
	assert.fileContent('package.json', /"meow"/);
	assert.noFileContent('package.json', /"update-notifier": "*"/);
});

test.serial('babel option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: false,
		babel: true,
		codecov: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.file('lib/index.js');
	assert.fileContent('package.json', /"babel-runtime": "*"/);
	assert.fileContent('package.json', /"babel": "*"/);
	assert.fileContent('package.json', /"test": "xo && npm run build && jest"/);
	assert.fileContent('package.json', /"build": "babel lib --out-dir=dist --optional=runtime"/);
	assert.fileContent('.gitignore', /dist/);
	assert.fileContent('package.json', /"xo": {[\r\n\s]*"esnext": true,[\r\n\s]*"ignores": \[[\r\n\s]*"dist\/\*\*"/g);
	assert.noFileContent('package.json', /"update-notifier": "*"/);
	assert.noFile('index.js');
});

test.serial('codecov option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'foo',
		githubUsername: 'radiovisual',
		website: 'test.com',
		cli: false,
		babel: false,
		codecov: true,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', /"coveralls": "*"/);
	assert.fileContent('package.json', /"collectCoverage": true/);
	assert.fileContent('readme.md', 'https://coveralls.io/repos/github/radiovisual');
	assert.fileContent('.travis.yml', '- cat ./coverage/lcov.info | coveralls');
});

test.serial('no codecoverage option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'foo',
		githubUsername: 'radiovisual',
		website: 'test.com',
		cli: false,
		babel: false,
		codecov: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.noFileContent('package.json', /"coveralls": "*"/);
	assert.noFileContent('package.json', /"collectCoverage": true/);
	assert.noFileContent('readme.md', 'https://coveralls.io/repos/github/radiovisual');
	assert.noFileContent('.travis.yml', '- cat ./coverage/lcov.info | coveralls');
});

test.serial('update notifier option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: false,
		babel: false,
		codecov: true,
		updateNotifier: true
	});

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', /"update-notifier": "*"/);
	assert.fileContent('index.js', /var updateNotifier = require\('update-notifier'\)/);
	assert.fileContent('index.js', /var pkg = require\('\.\/package\.json'\)/);
	assert.fileContent('index.js', /updateNotifier\(\{pkg\}\)\.notify\(\)/);
});
