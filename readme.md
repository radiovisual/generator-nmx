# generator-nmx [![Build Status](https://travis-ci.org/radiovisual/generator-nmx.svg?branch=master)](https://travis-ci.org/radiovisual/generator-nmx)

> Scaffold out a node module with options to include babel, nyc and coveralls.

This generator is based off of [this awesome node module generator](https://github.com/sindresorhus/generator-nm), but I needed some extra configuration options when scaffolding out large node modules, so I added the following:

- Option to include [nyc](https://github.com/bcoe/nyc) for test coverage.
- Option to include [coveralls](https://github.com/nickmerwin/node-coveralls) for added coverage support.
- Option to include [babel](https://babeljs.io/) and the [babel-runtime](https://www.npmjs.com/package/babel-runtime) for ES6 support.

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
