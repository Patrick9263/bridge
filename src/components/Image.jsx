import React from 'react';

const Image = props => {
	const {
		mode, src, height, width, style,
	} = props;

	const modes = {
		fill: 'cover',
		fit: 'contain',
	};
	const size = modes[mode] || 'contain';

	const defaults = {
		height: height || 100,
		width: width || 100,
		backgroundColor: 'transparent',
	};

	const important = {
		backgroundImage: `url("${src}")`,
		backgroundSize: size,
		backgroundPosition: 'center center',
		backgroundRepeat: 'no-repeat',
	};

	return <div {...props} style={{ ...defaults, ...style, ...important }} />;
};

export default Image;
