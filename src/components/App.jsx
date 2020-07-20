import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './HomePage/Home.jsx';
import About from './AboutPage/About.jsx';

const App = () => (
	<Router>
		<Switch>
			<Route exact path="/home" component={Home} />
			<Route exact path="/about" component={About} />
			<Route path="/" component={Home} />
		</Switch>
	</Router>
);

export default App;
