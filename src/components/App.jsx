import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import styles from "./App.scss";

const App = () => {
	return (
		<div className={styles.container}>
			<Jumbotron>
				<h1>bridge</h1>
				<p>This is a jumbotron from react-bootstrap</p>
			</Jumbotron>
		</div>
	);
};

export default App;
