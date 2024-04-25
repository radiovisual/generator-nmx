module.exports = {
  transform: {'^.+\\.(js|jsx)$': 'babel-jest'},
  collectCoverage: <%- Boolean(codecov) %>,
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['**/*.{js,jsx}','!**/node_modules/**','!./coverage/**','!./*config.js'],
  coverageReporters: ['lcov', 'text']
};
