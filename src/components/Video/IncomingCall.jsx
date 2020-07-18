import React, { useState } from 'react';
import { Button, Toast } from 'react-bootstrap';
import { getTimeStamp } from '../../api/tools';
// import PropTypes from 'prop-types';

const container = {
	position: 'absolute',
	top: 55,
	right: 0,
	minHeight: '200px',
	zIndex: 1000,
};

const toast = {
	position: 'absolute',
	top: 0,
	right: 0,
	minWidth: '300px',
	zIndex: 1000,
};

const IncomingCall = props => {
	const [showToast, setShowToast] = useState(true);

	const handleIgnore = () => {
		props.ignoreCall();
		setShowToast(false);
	};
	const handleAccept = () => {
		props.acceptCall();
		setShowToast(false);
	};

	return (
		<>
			<div aria-live="polite" aria-atomic="true" style={container}>
				<div style={toast}>
					<Toast show={showToast}>
						<Toast.Header>
							<img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
							<strong className="mr-auto">Incoming call</strong>
							<small>{getTimeStamp()}</small>
						</Toast.Header>
						<Toast.Body>
							{props.caller}
							<br />
							<br />
							<Button variant="danger" size="sm" onClick={handleIgnore} style={{ marginRight: 10 }}>
							Ignore
							</Button>
							<Button variant="success" size="sm" onClick={handleAccept}>
							Accept
							</Button>
						</Toast.Body>
					</Toast>
				</div>
			</div>
		</>
	);
};

// IncomingCall.propTypes = {};

export default IncomingCall;
