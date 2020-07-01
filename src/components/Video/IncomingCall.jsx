import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import { Button, Toast } from 'react-bootstrap';

const container = {
	position: 'absolute',
	top: 55,
	right: 0,
	minHeight: '200px',
};

const toast = {
	position: 'absolute',
	top: 0,
	right: 0,
	minWidth: '300px',
};

const IncomingCall = props => {
	const [show, setShow] = useState(true);

	const toggleShow = () => setShow(!show);

	const handleClose = () => {
		props.ignoreCall();
		setShow(false);
		toggleShow();
	};
	const handleAccept = () => {
		props.acceptCall();
		setShow(false);
		toggleShow();
	};

	return (
		<>
			<div
				aria-live="polite"
				aria-atomic="true"
				style={container}
			>
				<div
					style={toast}
				>
					<Toast show={show} onClose={toggleShow}>
						<Toast.Header>
							<img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
							<strong className="mr-auto">Incoming call</strong>
							<small>just now</small>
						</Toast.Header>
						<Toast.Body>
							{props.caller}
							<br />
							<br />
							<Button variant="danger" size="sm" onClick={handleClose} style={{ marginRight: 10 }}>
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
