'use strict';
const superb = require('superb');
const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const yeoman = require('yeoman-generator');
const _s = require('underscore.string');

module.exports = yeoman.Base.extend({
	init() {
		const cb = this.async();
		const self = this;

		this.prompt([{
			name: 'moduleName',
			message: 'What do you want to name your module?',
			default: this.appname.replace(/\s/g, '-'),
			filter: x => _s.slugify(x)
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			store: true,
			validate: x => x.length > 0 ? true : 'You have to provide a username'
		}, {
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			validate: x => x.length > 0 ? true : 'You have to provide a website URL',
			filter: x => normalizeUrl(x)
		}, {
			name: 'babel',
			message: 'Do you want to add the babel-runtime for ES6 support?',
			type: 'confirm',
			default: false
		}, {
			name: 'cli',
			message: 'Do you need a CLI?',
			type: 'confirm',
			default: false
		}, {
			name: 'nyc',
			message: 'Do you need code coverage (nyc)?',
			type: 'confirm',
			default: false
		}, {
			name: 'coveralls',
			message: 'Do you want to use coveralls?',
			type: 'confirm',
			default: false
		}, {
			name: 'updateNotifier',
			message: 'Do you want to add update-notifier?',
			type: 'confirm',
			default: false
		}], props => {
			const tpl = {
				moduleName: props.moduleName,
				camelModuleName: _s.camelize(props.moduleName),
				githubUsername: props.githubUsername,
				name: self.user.git.name(),
				email: self.user.git.email(),
				website: props.website,
				humanizedWebsite: humanizeUrl(props.website),
				superb: superb(),
				cli: props.cli,
				nyc: props.nyc,
				coveralls: props.coveralls,
				babel: props.babel,
				updateNotifier: props.updateNotifier
			};

			const mv = (from, to) => {
				self.fs.move(self.destinationPath(from), self.destinationPath(to));
			};

			self.fs.copyTpl([
				`${self.templatePath()}/**`,
				'!**/cli.js',
				'!**/lib',
				'!**/index.js'
			], self.destinationPath(), tpl);

			if (props.babel) {
				self.fs.copyTpl(self.templatePath('lib'), self.destinationPath('lib'), tpl);
			} else {
				self.fs.copyTpl(self.templatePath('index.js'), self.destinationPath('index.js'), tpl);
			}

			if (props.cli) {
				self.fs.copyTpl(self.templatePath('cli.js'), self.destinationPath('cli.js'), tpl);
			}

			mv('editorconfig', '.editorconfig');
			mv('gitattributes', '.gitattributes');
			mv('gitignore', '.gitignore');
			mv('travis.yml', '.travis.yml');
			mv('_package.json', 'package.json');

			cb();
		});
	},
	git() {
		this.spawnCommandSync('git', ['init']);
	},
	install() {
		this.installDependencies({bower: false});
	}
});
