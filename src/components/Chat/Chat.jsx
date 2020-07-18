import React, { useEffect, useState } from 'react';
import Peer from 'simple-peer';
import { getTimeStamp } from '../../api/tools';
import styles from './Chat.scss';
import FriendsList from '../Video/FriendsList.jsx';

const Chat = props => {
	const { socket, yourID, users } = props;
	const [messageList, setMessageList] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [peerID, setPeerID] = useState();
	const [renderCount, setRenderCount] = useState(0);

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

			peer.on('signal', data => {
				socket.current.emit('sendMsg', {
					userIdToSend: peerID, signalData: data, from: yourID, message: newMessage,
				});
				peer.signal({});
			});
			peer.on('connect', () => {
				peer.send(newMessage);
			});
			peer.on('close', () => { peer.destroy(); console.log('peer destroyed'); });
			peer.on('error', () => { console.log('disconnected from peer'); });

			addToMessageList('Me', getTimeStamp(), newMessage);
		}
	};

	const messages = messageList.map((msg, index) => (
		<div key={index} className={styles.messageStyle}>
			<div style={{ display: 'flex' }}>
				<div style={{ fontWeight: 700, marginRight: 10 }}>{msg.author}</div>
				<div style={{ color: 'grey' }}>{'  at  '}{msg.time}</div>
			</div>
			<p>{msg.message}</p>
		</div>
	));

	useEffect(() => {
		if (socket.current && renderCount === 0) {
			socket.current.on('rcvMsg', data => {
				addToMessageList(data.from, getTimeStamp(), data.message);
			});
			setRenderCount(1);
		}
	}, [socket, yourID, users]);
	return (
		<>
			<div className={styles.container}>

				<div className={styles.friendsList}>
					<FriendsList users={users} yourID={yourID} messagePeer={setPeerID} callPeer={() => {}} />
				</div>

				<div className={styles.chatContainer}>
					<div className={styles.chatBox}>

						<div className={styles.messageList}>{messages}</div>
						<form onSubmit={handleSubmit} className={styles.form}>
							<input
								type="text"
								className={styles.textBox}
								placeholder="Message"
								value={newMessage}
								onChange={event => setNewMessage(event.target.value)}
							/>
						</form>
					</div>
				</div>

			</div>
		</>
	);
};

export default Chat;
