import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import styles from './App.scss';
import banner from './bridgeFull.png';

import Image from './Image.jsx';

const App = () => (
	<div className={styles.container}>
		<Jumbotron>
			<Image src={banner} width="100%" height={540} />
		</Jumbotron>
	</div>
);

export default App;
