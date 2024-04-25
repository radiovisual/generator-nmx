'use strict';
const superb = require('superb');
const normalizeUrl = require('normalize-url');
const Generator = require('yeoman-generator');
const _s = require('underscore.string');

module.exports = class extends Generator {
	constructor(...arguments_) {
		super(...arguments_);

		this.option('cli', {
			type: 'boolean',
			desc: 'Add a CLI',
		});

		this.option('codecov', {
			type: 'boolean',
			desc: 'Upload coverage to codecov.io (implies coverage)',
		});
	}

	init() {
		return this.prompt([
			{
				name: 'repoName',
				message: 'What do you want to name your module?',
				default: this.appname.replaceAll(/\s/g, '-'),
				filter: x => _s.slugify(x),
			},
			{
				name: 'moduleDescription',
				message: 'What is your module description?',
				default: `My ${superb()} module`,
			},
			{
				name: 'githubUsername',
				message: 'What is your GitHub username?',
				store: true,
				validate: x =>
					x.length > 0 ? true : 'You have to provide a username',
			},
			{
				name: 'website',
				message: 'What is the URL of your website?',
				store: true,
				validate: x =>
					x.length > 0 ? true : 'You have to provide a website URL',
				filter: x => normalizeUrl(x),
			},
			{
				name: 'babel',
				message: 'Do you want to add the babel-runtime for ES6 support?',
				type: 'confirm',
				default: false,
			},
			{
				name: 'cli',
				message: 'Do you need a CLI?',
				type: 'confirm',
				default: false,
			},
			{
				name: 'codecov',
				message: 'Do you want to upload code coverage to codecov.io?',
				type: 'confirm',
				default: false,
			},
			{
				name: 'updateNotifier',
				message: 'Do you want to add update-notifier?',
				type: 'confirm',
				default: false,
			},
		]).then(properties => {
			const or = (option, property) =>
				this.options[option] === undefined
					? properties[property || option]
					: this.options[option];

			const cli = or('cli');
			const codecov = or('codecov');
			const babel = or('babel');
			const updateNotifier = or('updateNotifier');

			const tpl = {
				repoName: properties.repoName,
				camelModuleName: _s.camelize(properties.repoName),
				moduleDescription: properties.moduleDescription,
				githubUsername: properties.githubUsername,
				name: this.user.git.name(),
				email: this.user.git.email(),
				website: properties.website,
				cli,
				codecov,
				babel,
				updateNotifier,
			};

			const mv = (from, to) => {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			};

			this.fs.copyTpl(
				[`${this.templatePath()}/**`, '!**/cli.js', '!**/lib', '!**/index.js'],
				this.destinationPath(),
				tpl,
			);

			if (babel) {
				this.fs.copyTpl(
					this.templatePath('lib'),
					this.destinationPath('lib'),
					tpl,
				);
			} else {
				this.fs.copyTpl(
					this.templatePath('index.js'),
					this.destinationPath('index.js'),
					tpl,
				);
			}

			if (cli) {
				this.fs.copyTpl(
					this.templatePath('cli.js'),
					this.destinationPath('cli.js'),
					tpl,
				);
			}

			mv('editorconfig', '.editorconfig');
			mv('gitattributes', '.gitattributes');
			mv('gitignore', '.gitignore');
			mv('npmrc', '.npmrc');
			mv('_package.json', 'package.json');
			mv('github/workflows/main.yml', '.github/workflows/main.yml');
		});
	}

	git() {
		this.spawnCommandSync('git', ['init']);
	}

	install() {
		this.installDependencies({bower: false});
	}
};
