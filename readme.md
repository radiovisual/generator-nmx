# generator-nmx [![Build Status](https://travis-ci.org/radiovisual/generator-nmx.svg?branch=master)](https://travis-ci.org/radiovisual/generator-nmx)

> Scaffold out a node module with options to include babel, nyc, coveralls and update-notifier.

This generator is based off of [this awesome node module generator](https://github.com/sindresorhus/generator-nm), but I needed some extra configuration options when scaffolding out large node modules, and I wanted to change the test runner to use Jest.

- [x] Option to include [nyc](https://github.com/bcoe/nyc) for test coverage
- [x] Option to include [coveralls](https://github.com/nickmerwin/node-coveralls) for added coverage support
- [x] Option to include [babel](https://babeljs.io/) and the [babel-runtime](https://www.npmjs.com/package/babel-runtime) for ES6 support
- [x] Option to include [update-notifier](https://github.com/yeoman/update-notifier)
- [x] Uses [Jest](https://github.com/facebook/jest) for the test runner

![screenshot](screenshot.png)

## Install

```
$ npm install --global generator-nmx
```


## Usage

With [yo](https://github.com/yeoman/yo):

```
$ yo nmx
```


## Tip

Use [chalk](https://github.com/sindresorhus/chalk) if you want colors in your CLI.


## License

MIT @ [Michael Wuergler](http://numetriclabs.com/)
