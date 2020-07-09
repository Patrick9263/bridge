import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './HomePage/Home.jsx';
import About from './AboutPage/About.jsx';
import ChatPage from './ChatPage/ChatPage.jsx';

const App = () => (
	<Router>
		<Switch>
			<Route exact path="/home" component={Home} />
			<Route exact path="/about" component={About} />
			<Route exact path="/chat" component={ChatPage} />
			<Route path="/" component={Home} />
		</Switch>
	</Router>
);

export default App;
