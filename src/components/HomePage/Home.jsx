import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

import Navigation from '../Navigation.jsx';
import VideoChat from '../Audio/VideoChat.jsx';
import styles from './Home.scss';

const Home = () => (
	<div className={styles.container}>
		<Navigation />
		<Jumbotron>
			<h1>bridge</h1>
			<p>This is a React-Boostrap Jumbotron.</p>
		</Jumbotron>
		<VideoChat />
	</div>
);

export default Home;
