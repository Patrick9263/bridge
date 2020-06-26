'use strict';

module.exports = {
	root: true,
	extends: 'airbnb-base',
	parser: 'babel-eslint',
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		}
	},
	env: {
		browser: true,
		"node": true,
		"es6": true,
		"jest": true
	},
	rules: {
		'no-console': 0,
		'arrow-parens': [2, 'as-needed'],
		'func-names': 0,
		'no-tabs': 0,
		'indent': [2, 'tabs'],
	},
	overrides: [
		{
			files: ['**/*.spec.js', '**/__mocks__/*.js'],
			env: { jest: true },
			plugins: ['jest'],
		},
		{
			files: ['.eslintrc.js', 'webpack.*.js', 'babel.config.js'],
			parserOptions: { sourceType: 'script' },
			rules: {
				strict: [2, 'global'],
			}
		},
	],
};
