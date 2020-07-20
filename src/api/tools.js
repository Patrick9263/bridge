// eslint-disable-next-line import/prefer-default-export
export const getTimeStamp = () => {
	const date = new Date();
	return `${date.getHours()}:${date.getMinutes()}`;
};

// pass in two booleans and userVideo to return stream with camera video and/or audio
export const getUserMedia = (video, audio, userVideo) => navigator.mediaDevices.getUserMedia({
	video, audio,
}).then(currentStream => {
	if (userVideo.current) {
		// eslint-disable-next-line no-param-reassign
		userVideo.current.srcObject = currentStream;
		return currentStream;
	}
	return null;
});

// pass in two booleans and userVideo to return stream with video and/or audio
export const getDisplayMedia = (video, audio, userVideo) => navigator.mediaDevices.getDisplayMedia({
	video, audio,
}).then(currentStream => {
	if (userVideo.current) {
		// eslint-disable-next-line no-param-reassign
		userVideo.current.srcObject = currentStream;
		return currentStream;
	}
	return null;
});
