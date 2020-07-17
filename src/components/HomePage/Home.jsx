import React from 'react';
import Navigation from '../Navigation/Navigation.jsx';
import VideoChat from '../Video/VideoChat.jsx';
import Chat from '../Chat/Chat.jsx';
import styles from './Home.scss';

const Home = () => (
	<div className={styles.home}>
		<Navigation />
		<Chat />
		{/* <VideoChat /> */}
	</div>
);

export default Home;
