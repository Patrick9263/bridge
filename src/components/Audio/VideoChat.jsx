import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

function VideoChat() {
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

	useEffect(() => {
		socket.current = io.connect('localhost:8000/');
		navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(currentStream => {
			setStream(currentStream);
			if (userVideo.current) {
				userVideo.current.srcObject = currentStream;
			}
		});

		socket.current.on('yourID', id => {
			setYourID(id);
		});
		socket.current.on('allUsers', currentUsers => {
			setUsers(currentUsers);
		});

		socket.current.on('hey', data => {
			setReceivingCall(true);
			setCaller(data.from);
			setCallerSignal(data.signal);
		});
	}, []);

	function callPeer(id) {
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
			socket.current.emit('callUser', { userToCall: id, signalData: data, from: yourID });
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
	}

	function acceptCall() {
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
	}

	let UserVideo;
	if (stream) {
		UserVideo = (
			<video playsInline muted ref={userVideo} autoPlay />
		);
	}

	let PartnerVideo;
	if (callAccepted) {
		PartnerVideo = (
			<video playsInline ref={partnerVideo} autoPlay />
		);
	}

	let incomingCall;
	if (receivingCall) {
		incomingCall = (
			<div>
				<h1>{caller} is calling you</h1>
				<button onClick={acceptCall}>Accept</button>
			</div>
		);
	}
	return (
		<div>
			<div>
				{UserVideo}
				{PartnerVideo}
			</div>
			<div>
				{Object.keys(users).map(key => {
					if (key === yourID) {
						return null;
					}
					return (
						<button key={key} onClick={() => callPeer(key)}>Call {key}</button>
					);
				})}
			</div>
			<div>
				{incomingCall}
			</div>
		</div>
	);
}

export default VideoChat;
