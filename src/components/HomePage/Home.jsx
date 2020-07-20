import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import Navigation from '../Navigation/Navigation.jsx';
import Chat from '../Chat/Chat.jsx';
import FriendsList from '../Video/FriendsList.jsx';
import VideoChat from '../Video/VideoChat.jsx';
import styles from './Home.scss';
import { getUserMedia } from '../../api/tools';

const Home = () => {
	const [yourID, setYourID] = useState('');
	const [users, setUsers] = useState({});
	const [peerID, setPeerID] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [stream, setStream] = useState();

	const socket = useRef();
	const partnerVideo = useRef();
	const userVideo = useRef();

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

	useEffect(() => {
		socket.current = io.connect('localhost:8000/');
		setStream(getUserMedia(false, true, userVideo));

		socket.current.on('yourID', id => {
			setYourID(id);
		});
		socket.current.on('allUsers', currentUsers => {
			setUsers(currentUsers);
		});
	}, []);
	return (
		<div className={styles.home}>
			<Navigation />
			<div className={styles.container}>
				<div className={styles.friendsList}>
					<FriendsList
						users={users}
						yourID={yourID}
						messagePeer={setPeerID}
						callPeer={callPeer}
						peerID={peerID}
					/>
				</div>
				<Chat
					socket={socket}
					yourID={yourID}
					users={users}
					peerID={peerID}
				/>
				<VideoChat
					socket={socket}
					yourID={yourID}
					partnerVideo={partnerVideo}
					callAccepted={callAccepted}
					setCallAccepted={setCallAccepted}
					stream={stream}
					userVideo={userVideo}
				/>
			</div>
		</div>
	);
};

export default Home;
