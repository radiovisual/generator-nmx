# <%= repoName %> [![CI](https://github.com/<%= githubUsername %>/<%= repoName %>/actions/workflows/main.yml/badge.svg)](https://github.com/<%= githubUsername %>/<%= repoName %>/actions/workflows/main.yml) <% if (codecov) { %> [![codecov](https://codecov.io/gh/<%= githubUsername %>/<%= repoName %>/badge.svg?branch=master)](https://codecov.io/gh/<%= githubUsername %>/<%= repoName %>?branch=master)<% } %>

> <%= moduleDescription %>

## Install

```
$ npm install --save <%= repoName %>
```

## Usage

```js
const <%= camelModuleName %> = require('<%= repoName %>');

<%= camelModuleName %>('unicorns');
//=> 'unicorns & rainbows'
```

## API

### <%= camelModuleName %>(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.<% if (cli) { %>

## CLI

```
$ npm install --global <%= repoName %>
```

````
$ <%= repoName %> --help

  Usage
    <%= repoName %> [input]

  Options
    --foo  Lorem ipsum. [Default: false]

  Examples
    $ <%= repoName %>
    unicorns & rainbows
    $ <%= repoName %> ponies
    ponies & rainbows
```<% } %>


## License

MIT © [<%= name %>](<%= website %>)
````
