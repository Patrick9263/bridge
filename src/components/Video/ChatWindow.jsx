import React, { useState, useEffect } from 'react';
import {
	Button, Form, FormControl, InputGroup,
} from 'react-bootstrap';

const ChatWindow = () => {
	const [messageList, setMessageList] = useState([]);
	const [newMessage, setNewMessage] = useState('');

	const handleSubmit = event => {
		event.preventDefault();
		setMessageList([...messageList,
			{
				author: 'me',
				time: 'now',
				message: newMessage,
			}]);
	};

	const handleOnChange = event => setNewMessage(event.target.value);

	const messageContainer = {
		display: 'flex',
		flexFlow: 'column wrap',
		width: '100%',
		padding: '10%',
	};
	const messageStyle = {
		display: 'flex',
		flexFlow: 'row wrap',
		padding: 10,
		wordBreak: 'break-word',
		width: '100%',
		justifyContent: 'space-between',
		color: '#f7f9fe',
		marginBottom: 20,
		borderRadius: '25px',
	};
	const msgFromMe = {
		...messageStyle,
		backgroundColor: '#2e70da',
		justifyContent: 'flex-end',
		paddingRight: 30,
	};
	const msgFromThem = {
		...messageStyle,
		backgroundColor: '#555555',
		justifyContent: 'flex-start',
		paddingLeft: 30,
	};

	const messageListStyle = messageList.map((msg, index) => (
		msg.author === 'me'
			? <div key={index} style={msgFromMe}>{msg.message}</div>
			: <div key={index} style={msgFromThem}>{msg.message}</div>
	));

	useEffect(() => {
		setMessageList([
			{
				author: 'me',
				time: 'now',
				message: 'hi',
			},
			{
				author: 'them',
				time: 'now',
				message: 'hey',
			},
			{
				author: 'me',
				time: 'now',
				message: 'how\'s it goin?',
			},
			{
				author: 'them',
				time: 'now',
				message: 'good thanks! hbu?',
			},
			{
				author: 'me',
				time: 'now',
				message: 'good! just testing the app, ya know?',
			},
		]);
	}, []);
	return (
		<div style={messageContainer}>
			{messageListStyle}

			<Form inline onSubmit={handleSubmit}>

				<Form.Control
					className="mb-2 mr-sm-2"
					id="inlineFormInputName2"
					placeholder="Message"
					value={newMessage}
					onChange={handleOnChange}
				/>

				<Button type="submit" className="mb-2">
					Send
				</Button>
			</Form>
		</div>
	);
};

export default ChatWindow;
