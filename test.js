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
		nyc: false,
		coveralls: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.file([
		'.editorconfig',
		'.git',
		'.gitattributes',
		'.gitignore',
		'.travis.yml',
		'index.js',
		'license',
		'package.json',
		'readme.md',
		'test.js'
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
		nyc: false,
		coveralls: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.file('cli.js');
	assert.fileContent('package.json', /"bin":/);
	assert.fileContent('package.json', /"bin": "cli.js"/);
	assert.fileContent('package.json', /"meow"/);
	assert.noFileContent('package.json', /"update-notifier"\: "*"/);
});

test.serial('babel option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: false,
		babel: true,
		nyc: false,
		coveralls: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.file('lib/index.js');
	assert.fileContent('package.json', /"babel-runtime": "\^5\.8\.29"/);
	assert.fileContent('package.json', /"babel": "\^5\.8\.23"/);
	assert.fileContent('package.json', /"test": "xo && npm run build && ava"/);
	assert.fileContent('package.json', /"build": "babel lib --out-dir=dist --optional=runtime"/);
	assert.fileContent('.gitignore', /dist/);
	assert.fileContent('package.json', /"xo": {[\r\n\s]*"esnext": true,[\r\n\s]*"ignores": \[[\r\n\s]*"dist\/\*\*"/g);
	assert.noFileContent('package.json', /"update-notifier"\: "*"/);
	assert.noFile('index.js');
});

test.serial('nyc option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: false,
		babel: false,
		nyc: true,
		coveralls: false,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', /"nyc": "\^5\.6\.0"/);
	assert.fileContent('package.json', /"test": "xo && ava && nyc ava"/);
	assert.fileContent('.gitignore', /\.nyc_output/);
	assert.fileContent('.gitignore', /coverage/);
	assert.noFileContent('package.json', /"update-notifier"\: "*"/);
});

test.serial('coveralls option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: false,
		babel: false,
		nyc: false,
		coveralls: true,
		updateNotifier: false
	});

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', /"coveralls": "\^2\.11\.6"/);
	assert.fileContent('package.json', /"coveralls": "nyc report --reporter=text-lcov | coveralls"/);
	assert.fileContent('readme.md', /\[!\[Coverage Status\]\(https:\/\/coveralls\.io\/repos\/github\/test\/test\/badge\.svg\?branch=master\)\]\(https:\/\/coveralls\.io\/github\/test\/test\?branch=master\)/);
	assert.fileContent('.travis.yml', /after_success: npm run coveralls/);
	assert.noFileContent('package.json', /"update-notifier"\: "*"/);
});

test.serial('update notifier option', async () => {
	helpers.mockPrompt(generator, {
		moduleName: 'test',
		githubUsername: 'test',
		website: 'test.com',
		cli: false,
		babel: false,
		nyc: false,
		coveralls: true,
		updateNotifier: true
	});

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', /"update-notifier"\: "*"/);
	assert.fileContent('index.js', /var updateNotifier = require\('update-notifier'\)/);
	assert.fileContent('index.js', /var pkg = require\('\.\/package\.json'\)/);
	assert.fileContent('index.js', /updateNotifier\(\{pkg\}\)\.notify\(\)/);
});
