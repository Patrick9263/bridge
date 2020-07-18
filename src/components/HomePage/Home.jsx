import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Navigation from '../Navigation/Navigation.jsx';
import VideoChat from '../Video/VideoChat.jsx';
import Chat from '../Chat/Chat.jsx';
import styles from './Home.scss';

const Home = () => {
	const [yourID, setYourID] = useState('');
	const [users, setUsers] = useState({});
	const socket = useRef();

	useEffect(() => {
		socket.current = io.connect('localhost:8000/');
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
			<Chat socket={socket} yourID={yourID} users={users} />
			{/* <VideoChat /> */}
		</div>
	);
};

export default Home;
