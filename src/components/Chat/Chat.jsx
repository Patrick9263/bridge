import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Form } from 'react-bootstrap';
import styles from './Chat.scss';
import FriendsList from '../Video/FriendsList.jsx';

const ChatPage = () => {
	const [yourID, setYourID] = useState('');
	const [users, setUsers] = useState({});

	const [messageList, setMessageList] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [peerID, setPeerID] = useState();
	const socket = useRef();

	const addToMessageList = (newAuthor, newTime, aNewMessage) => {
		// eslint-disable-next-line no-shadow
		setMessageList(messageList => messageList.concat([{
			author: newAuthor,
			time: newTime,
			message: aNewMessage,
		}]));
		setNewMessage('');
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

	const messageListStyle = messageList.map((msg, index) => {
		const msgStyle = msg.author === 'me' ? styles.msgFromMe : styles.msgFromThem;
		return <div key={index} className={msgStyle}>{msg.message}</div>;
	});

	useEffect(() => {
		socket.current = io.connect('localhost:8000/');

		socket.current.on('yourID', id => {
			setYourID(id);
		});
		socket.current.on('allUsers', currentUsers => {
			setUsers(currentUsers);
		});

		socket.current.on('rcvMsg', data => {
			console.log(`receiving message: ${data.message}`);
			addToMessageList('them', 'now', data.message);
		});
	}, []);
	return (
		<>
			<div className={styles.container}>

				<div className={styles.friendsList}>
					<FriendsList users={users} yourID={yourID} messagePeer={setPeerID} callPeer={() => {}} />
				</div>

				<div className={styles.messageContainer}>
					{messageListStyle}

					<Form inline onSubmit={handleSubmit} style={{ width: '100%' }}>
						<Form.Control
							style={{ width: '100%' }}
							id="inlineFormInputName2"
							placeholder="Message"
							value={newMessage}
							onChange={event => setNewMessage(event.target.value)}
						/>
					</Form>
				</div>

			</div>
		</>
	);
};

export default ChatPage;
