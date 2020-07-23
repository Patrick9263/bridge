// eslint-disable-next-line import/prefer-default-export
export const getTimeStamp = () => {
	const date = new Date();
	return `${date.getHours()}:${date.getMinutes()}`;
};

// pass in two booleans and userVideo to return stream with camera video and/or audio
export function getUserMedia(video, audio) {
	return navigator.mediaDevices.getUserMedia({ video, audio });
}

// pass in two booleans and userVideo to return stream with screen share and optionally audio
export function getDisplayMedia(video, audio, userVideo) {
	return navigator.mediaDevices.getDisplayMedia({ video, audio })
		.then(currentStream => {
			if (userVideo.current) {
			// eslint-disable-next-line no-param-reassign
				userVideo.current.srcObject = currentStream;
			}
			return currentStream;
		});
}
