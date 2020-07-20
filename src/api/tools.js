// eslint-disable-next-line import/prefer-default-export
export const getTimeStamp = () => {
	const date = new Date();
	return `${date.getHours()}:${date.getMinutes()}`;
};
