import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import { Button, ListGroup, Toast } from 'react-bootstrap';
import IncomingCall from './IncomingCall.jsx';
import FriendsList from './FriendsList.jsx';

// https://github.com/coding-with-chaim/react-video-chat

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

	useEffect(() => {
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
	}, []);

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

		socket.current.on('callIgnored', () => {
			setCallAccepted(false);
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
		setReceivingCall(false);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});
		peer.on('signal', () => {
			socket.current.emit('ignoreCall', { to: caller });
		});
	};

	const [showToast, setShowToast] = useState(true);
	const [timeStamp, setTimeStamp] = useState(
		new Date().toLocaleDateString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}),
	);
	const container = {
		position: 'absolute',
		top: 55,
		right: 0,
		minHeight: '200px',
	};
	const toast = {
		position: 'absolute',
		top: 0,
		right: 0,
		minWidth: '300px',
	};
	const incomingCall = (
		<div>
			<h1>{caller} is calling you</h1>
			<button onClick={acceptCall}>Accept</button>
		</div>
	);

	const styles = {
		userList: {
			display: 'flex',
			flexDirection: 'column',
			// borderStyle: 'solid',
			// borderColor: 'black',
			// borderWidth: '1px',
			width: '40%',
		},
		friend: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			height: '100%',
			// borderStyle: 'solid',
			// borderColor: 'black',
			// borderWidth: '1px',
		},
	};
	const userList = (
		Object.keys(users).map(key => {
			if (key !== yourID) {
				return (
					<ListGroup.Item key={`${key}_`} >
						<div key={`${key}__`} style={styles.friend} >
							<p key={`${key}___`}>{key}</p>
							<Button
								key={key}
								variant="success"
								onClick={() => callPeer(key)}
								style={{ width: '50' }}
							>
								Call
							</Button>
						</div>
					</ListGroup.Item>
				);
			}
			return '';
		}));

	return (
		<div>
			{receivingCall ? incomingCall : ''}
			{userList}
			{stream ? <video playsInline muted ref={userVideo} autoPlay /> : ''}
			{callAccepted ? <video playsInline ref={partnerVideo} autoPlay /> : ''}

		</div>
	);
};

export default VideoChat;
