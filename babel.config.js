'use-strict';

/* eslint strict: ["error", "never"] */
module.exports = function (api) {
	api.cache(true);

	const presets = [
		['@babel/preset-env',
			{
				targets: {
					esmodules: true,
				},
			}],
		'@babel/preset-react',
	];
	const plugins = ['@babel/plugin-transform-react-jsx'];

	return {
		presets,
		plugins,
	};
};
