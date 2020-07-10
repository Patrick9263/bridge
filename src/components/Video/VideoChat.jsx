import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import { Button } from 'react-bootstrap';
import IncomingCall from './IncomingCall.jsx';
import FriendsList from './FriendsList.jsx';
import ChatWindow from './ChatWindow.jsx';

// https://github.com/coding-with-chaim/react-video-chat

// https://reactjs.org/docs/context.html
// https://reactjs.org/docs/composition-vs-inheritance.html
// https://reactjs.org/docs/render-props.html

const VideoChat = props => {
	const [yourID, setYourID] = useState('');
	const [users, setUsers] = useState({});
	const [stream, setStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState('');
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [showVideo, setShowVideo] = useState(false);

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

	const allPeers = {
		startCall: new Peer({
			initiator: true,
			trickle: false,
			config,
			stream,
		}),
		acceptCall: new Peer({
			initiator: false,
			trickle: false,
			stream,
		}),
		ignoreCall: new Peer({
			initiator: false,
			trickle: false,
		}),
		endCall: new Peer({
			initiator: false,
			trickle: false,
			stream,
		}),
	};

	const userVideo = useRef();
	const partnerVideo = useRef();
	const socket = useRef();

	const callPeer = id => {
		const peer = allPeers.startCall;
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
		const peer = allPeers.acceptCall;
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
		const peer = allPeers.ignoreCall;
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });
		peer.on('signal', data => {
			socket.current.emit('ignoreCall', { signal: data, to: caller });
		});
		peer.signal(callerSignal);
		setReceivingCall(false);
	};

	const endCall = () => {
		setCallAccepted(false);
		setReceivingCall(false);
		const peer = allPeers.endCall;
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });
		peer.on('signal', () => {
			socket.current.emit('endCall', { to: caller });
		});

		Object.keys(allPeers).forEach(p => { allPeers[p].destroy(); });
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
		// navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		// 	.then(currentStream => {
		// 		setStream(currentStream);
		// 		if (userVideo.current) {
		// 			userVideo.current.srcObject = currentStream;
		// 		}
		// 	});

		socket.current.on('yourID', id => {
			setYourID(id);
			props.setId(id);
		});
		socket.current.on('allUsers', currentUsers => {
			setUsers(currentUsers);
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

		socket.current.on('callEnded', data => {
			setReceivingCall(false);
			setCaller(data.from);
			setCallerSignal(data.signal);
			endCall();
			console.log('callEnded');
		});
	};

	const toggleVideo = () => {
		setShowVideo(!showVideo);
		navigator.mediaDevices.getUserMedia({ video: showVideo, audio: true })
			.then(currentStream => {
				setStream(currentStream);
				if (userVideo.current) {
					userVideo.current.srcObject = currentStream;
				}
			});
	};

	useEffect(initSocket, []);
	const container = {
		height: '30em',
		display: 'flex',
		flexFlow: 'row nowrap',
		border: '1px solid blue',
	};
	return (
		<div style={container}>

			{receivingCall
				? <IncomingCall ignoreCall={ignoreCall} acceptCall={acceptCall} caller={caller} />
				: ''
			}

			<div style={{ border: '1px solid red', height: '100%', width: '30%' }}>
				<FriendsList users={users} yourID={yourID} callPeer={callPeer} />
			</div>

			<div style={{ border: '1px solid green', height: '100%', width: '30%' }}>
				<ChatWindow />
			</div>

			<div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
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
				<Button variant="primary" onClick={toggleVideo}>Toggle Video</Button>
			</div>

			<div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
				{incomingVideo()}
			</div>

		</div>
	);
};

export default VideoChat;
