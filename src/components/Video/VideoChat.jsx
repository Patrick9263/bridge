import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import {
	Button, Form, FormControl, InputGroup, Card,
} from 'react-bootstrap';
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
	const [messageList, setMessageList] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [peerID, setPeerID] = useState();

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
	const socket = useRef();

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

	const addToMessageList = (newAuthor, newTime, aNewMessage) => {
		// eslint-disable-next-line no-shadow
		setMessageList(messageList => messageList.concat([{
			author: newAuthor,
			time: newTime,
			message: aNewMessage,
		}]));
		setNewMessage('');
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

		socket.current.on('yourID', id => {
			setYourID(id);
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

		socket.current.on('callEnded', () => {
			console.log('ending call...');
			endCall();
		});

		socket.current.on('rcvMsg', data => {
			console.log(`receiving message: ${data.message}`);
			addToMessageList('them', 'now', data.message);
		});
	};

	const handleSubmit = event => {
		event.preventDefault();

		if (newMessage.length > 0) {
			const peer = new Peer({ initiator: true });
			peer.on('close', () => { peer.destroy(); console.log('peer destroyed'); });
			peer.on('error', () => { console.log('disconnected from peer'); });

			peer.on('signal', data => {
				socket.current.emit('sendMsg', {
					userIdToSend: peerID, signalData: data, from: yourID, message: newMessage,
				});
				peer.signal({});
			});

			peer.on('connect', () => {
				peer.send(newMessage);
			});
			addToMessageList('me', 'now', newMessage);
		}
	};

	const handleOnChange = event => setNewMessage(event.target.value);

	const messageContainer = {
		display: 'flex',
		flexFlow: 'column wrap',
		alignItems: 'center',
		justifyContent: 'flex-end',
		width: '35vw',
		height: '100%',
		border: '1px solid green',
	};
	const messageStyle = {
		display: 'flex',
		flexFlow: 'row wrap',
		padding: 10,
		wordBreak: 'break-word',
		width: '50%',
		justifyContent: 'space-between',
		color: '#f7f9fe',
		marginBottom: 20,
		borderRadius: '25px',
	};
	const msgFromMe = {
		...messageStyle,
		backgroundColor: '#2e70da',
		justifyContent: 'flex-end',
		paddingRight: 30,
	};
	const msgFromThem = {
		...messageStyle,
		backgroundColor: '#555555',
		justifyContent: 'flex-start',
		paddingLeft: 30,
	};

	const messageListStyle = messageList.map((msg, index) => (
		msg.author === 'me'
			? <div key={index} style={msgFromMe}>{msg.message}</div>
			: <div key={index} style={msgFromThem}>{msg.message}</div>
	));

	useEffect(initSocket, []);
	const container = {
		height: '80vh',
		display: 'flex',
		flexFlow: 'row nowrap',
		// border: '1px solid blue',
	};
	return (
		<div style={container}>

			{receivingCall
				? <IncomingCall ignoreCall={ignoreCall} acceptCall={acceptCall} caller={caller} />
				: ''
			}
			<div style={{ border: '1px solid red', height: '100%', width: '30vw' }}>
				<FriendsList users={users} yourID={yourID} messagePeer={setPeerID} callPeer={callPeer} />
			</div>

			<div style={messageContainer}>
				{messageListStyle}

				<Form inline onSubmit={handleSubmit} style={{ width: '100%' }}>
					<Form.Control
						style={{ width: '100%' }}
						id="inlineFormInputName2"
						placeholder="Message"
						value={newMessage}
						onChange={handleOnChange}
					/>
				</Form>
			</div>

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
