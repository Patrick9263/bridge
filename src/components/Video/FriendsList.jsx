import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import styles from './FriendsList.scss';

const FriendsList = props => {
	const [userList, setUserList] = useState('');

	useEffect(() => {
		setUserList(Object.keys(props.users).map(key => {
			if (key !== props.yourID) {
				return (
					<div key={`${key}_FriendList`} >
						<div key={`${key}_div`} className={styles.friend} >
							<div key={`${key}_p`} style={{ gridArea: '1/1/1/1', padding: '1em' }}>{key}</div>
							<Button
								key={`${key}_chat`}
								variant="primary"
								onClick={() => props.messagePeer(key)}
								style={{ gridArea: '1/2/1/2' }}
							>
								Chat
							</Button>
							<Button
								key={`${key}_call`}
								variant="success"
								onClick={() => props.callPeer(key)}
								style={{ gridArea: '1/4/1/4', marginLeft: '2m' }}
							>
								Call
							</Button>
						</div>
					</div>
				);
			}
			return '';
		}));
	}, [props.users, props.callPeer, props.messagePeer, props.yourID]);

	return (
		<div className={styles.sideBar}>
			<div className={styles.userList}>{userList}</div>
			<div className={styles.yourID}>{props.yourID}</div>
		</div>
	);
};

FriendsList.propTypes = {
	users:	PropTypes.object,
	yourID:	PropTypes.string,
	callPeer:	PropTypes.func,
};

export default FriendsList;
