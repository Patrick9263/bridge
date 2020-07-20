import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Button } from 'react-bootstrap';
import IncomingCall from './IncomingCall.jsx';

// https://github.com/coding-with-chaim/react-video-chat

// https://reactjs.org/docs/context.html
// https://reactjs.org/docs/composition-vs-inheritance.html
// https://reactjs.org/docs/render-props.html

const VideoChat = props => {
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState('');
	const [callerSignal, setCallerSignal] = useState();
	const {
		socket, yourID, partnerVideo, callAccepted, setCallAccepted, stream, userVideo,
	} = props;

	const acceptCall = () => {
		setCallAccepted(true);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });

		peer.on('signal', data => {
			socket.current.emit('acceptCall', { signal: data, to: caller });
		});
		peer.on('stream', currentStream => {
			partnerVideo.current.srcObject = currentStream;
		});
		peer.signal(callerSignal);
	};

	const ignoreCall = () => {
		setCallAccepted(false);
		const peer = new Peer({
			initiator: false,
			trickle: false,
		});
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });
		peer.on('signal', data => {
			socket.current.emit('ignoreCall', { signal: data, to: caller });
		});
		peer.signal(callerSignal);
		setReceivingCall(false);
	};

	const endCall = () => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
		});
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });
		peer.on('signal', () => {
			socket.current.emit('endCall', { to: caller });
		});
		socket.current.on('callEnded', () => {
			console.log('callEnded');
		});
		console.log('resetting state...');
		setCallAccepted(false);
		setReceivingCall(false);
		setCaller(null);
		setCallerSignal(null);
	};

	const incomingVideo = () => {
		if (callAccepted) {
			return (
				<>
					<video
						playsInline
						ref={partnerVideo}
						autoPlay
						style={{ height: 300, width: 'auto' }}
					/>
					<Button variant="danger" onClick={endCall}>End Call</Button>
				</>
			);
		}
		return '';
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.on('receivingCall', data => {
				setReceivingCall(true);
				setCaller(data.from);
				setCallerSignal(data.signal);
			});

			socket.current.on('callIgnored', data => {
				setReceivingCall(false);
				setCaller(data.from);
				setCallerSignal(data.signal);
			});

			socket.current.on('callEnded', () => {
				console.log('ending call...');
				endCall();
			});
		}
	}, [socket, yourID, partnerVideo]);
	const container = {
		height: '100px',
	};
	return (
		<div style={container}>

			{receivingCall
				? <IncomingCall ignoreCall={ignoreCall} acceptCall={acceptCall} caller={caller} />
				: ''
			}

			{stream
				? <video
					playsInline
					muted
					ref={userVideo}
					autoPlay
					style={{ height: 300, width: 'auto' }}
				/>
				: ''
			}
			{incomingVideo()}

		</div>
	);
};

export default VideoChat;
