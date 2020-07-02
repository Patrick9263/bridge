import React, { useState } from 'react';

import Navigation from '../Navigation.jsx';
import VideoChat from '../Video/VideoChat.jsx';
import styles from './Home.scss';

const Home = () => {
	const [Id, setId] = useState('');

	return (
		<div className={styles.container}>
			<Navigation id={Id} />
			<VideoChat setId={setId} />
		</div>
	);
};

export default Home;
