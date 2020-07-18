import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Button } from 'react-bootstrap';
import IncomingCall from './IncomingCall.jsx';
import FriendsList from './FriendsList.jsx';

// https://github.com/coding-with-chaim/react-video-chat

// https://reactjs.org/docs/context.html
// https://reactjs.org/docs/composition-vs-inheritance.html
// https://reactjs.org/docs/render-props.html

const VideoChat = props => {
	const [stream, setStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState('');
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const { socket, yourID } = props;

	const config = {
		iceServers: [
			{
				urls: 'stun:numb.viagenie.ca',
				username: 'sultan1640@gmail.com',
				credential: '98376683',
			},
			{
				urls: 'turn:numb.viagenie.ca',
				username: 'sultan1640@gmail.com',
				credential: '98376683',
			},
		],
	};

	const userVideo = useRef();
	const partnerVideo = useRef();

	const callPeer = id => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			config,
			stream,
		});
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });

		peer.on('signal', data => {
			socket.current.emit('callUser', { userIdToCall: id, signalData: data, from: yourID });
		});

		peer.on('stream', currentStream => {
			if (partnerVideo.current) {
				partnerVideo.current.srcObject = currentStream;
			}
		});

		socket.current.on('callAccepted', signal => {
			setCallAccepted(true);
			peer.signal(signal);
		});
	};

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

	const initSocket = () => {
		socket.current = io.connect('localhost:8000/');
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(currentStream => {
				setStream(currentStream);
				if (userVideo.current) {
					userVideo.current.srcObject = currentStream;
				}
			});

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
	};

	useEffect(initSocket, []);
	const container = {
		height: '80vh',
		display: 'flex',
		flexFlow: 'row nowrap',
	};
	return (
		<div style={container}>

			{receivingCall
				? <IncomingCall ignoreCall={ignoreCall} acceptCall={acceptCall} caller={caller} />
				: ''
			}

			<div style={{
				width: '35vw', display: 'flex', flexFlow: 'column nowrap', border: '1px solid blue',
			}}>
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
				{/* <Button variant="primary" onClick={toggleVideo}>Toggle Video</Button> */}
				{incomingVideo()}
			</div>

		</div>
	);
};

export default VideoChat;
