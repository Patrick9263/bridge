import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import { Button, ListGroup, Toast } from 'react-bootstrap';
import IncomingCall from './IncomingCall.jsx';
import FriendsList from './FriendsList.jsx';

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

	const userVideo = useRef();
	const partnerVideo = useRef();
	const socket = useRef();

	const initSocket = () => {
		socket.current = io.connect('localhost:8000/');
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(currentStream => {
				setStream(currentStream);
				if (userVideo.current) {
					userVideo.current.srcObject = currentStream;
				}
			});

		socket.current.on('yourID', id => {
			setYourID(id);
			props.setId(id);
		});
		socket.current.on('allUsers', currentUsers => {
			setUsers(currentUsers);
		});

		socket.current.on('callingUser', data => {
			setReceivingCall(true);
			setCaller(data.from);
			setCallerSignal(data.signal);
		});

		socket.current.on('callIgnored', data => {
			setReceivingCall(false);
			setCaller(data.from);
			setCallerSignal(data.signal);
			console.log('call ignored');
		});
	};

	useEffect(() => { initSocket(); }, []);

	const callPeer = id => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			config: {

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
			},
			stream,
		});

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
		peer.on('signal', data => {
			socket.current.emit('ignoreCall', { signal: data, to: caller });
		});
		peer.signal(callerSignal);
		setReceivingCall(false);
	};

	const endCall = () => {
		setCallAccepted(false);
		setReceivingCall(false);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});
		peer.on('signal', () => {
			socket.current.emit('endCall', { to: caller });
		});
	};

	return (
		<div>
			{receivingCall
				? <IncomingCall ignoreCall={ignoreCall} acceptCall={acceptCall} caller={caller} />
				: ''
			}
			<FriendsList users={users} yourID={yourID} callPeer={callPeer} />
			{stream ? <video playsInline muted ref={userVideo} autoPlay /> : ''}
			{callAccepted ? <video playsInline ref={partnerVideo} autoPlay /> : ''}
		</div>
	);
};

export default VideoChat;
