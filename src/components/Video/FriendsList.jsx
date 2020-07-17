import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroup } from 'react-bootstrap';

const FriendsList = props => {
	const [userList, setUserList] = useState('');

	const styles = {
		userList: {
			display: 'flex',
			flexDirection: 'column',
			// borderStyle: 'solid',
			// borderColor: 'black',
			// borderWidth: '1px',
			width: '100%',
		},
		friend: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			height: '100%',
			// borderStyle: 'solid',
			// borderColor: 'black',
			// borderWidth: '1px',
		},
	};

	useEffect(() => {
		setUserList(Object.keys(props.users).map(key => {
			if (key !== props.yourID) {
				return (
					<ListGroup.Item key={`${key}_ListGroupItem`} >
						<div key={`${key}_div`} style={styles.friend} >
							<p key={`${key}_p`}>{key}</p>
							<Button
								key={`${key}_chat`}
								variant="primary"
								onClick={() => props.messagePeer(key)}
								style={{ width: '50' }}
							>
								Chat
							</Button>
							<Button
								key={`${key}_call`}
								variant="success"
								onClick={() => props.callPeer(key)}
								style={{ width: '50' }}
							>
								Call
							</Button>
						</div>
					</ListGroup.Item>
				);
			}
			return '';
		}));
	}, [props.users, props.callPeer, props.messagePeer, props.yourID]);

	return (
		<ListGroup style={styles.userList}>
			<ListGroup.Item>{props.yourID}</ListGroup.Item>
			{userList}
		</ListGroup>
	);
};

FriendsList.propTypes = {
	users:	PropTypes.object,
	yourID:	PropTypes.string,
	callPeer:	PropTypes.func,
};

export default FriendsList;
