import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import Peer from 'simple-peer';
import { Button } from 'react-bootstrap';
import IncomingCall from './IncomingCall.jsx';

// https://github.com/coding-with-chaim/react-video-chat

// https://reactjs.org/docs/context.html
// https://reactjs.org/docs/composition-vs-inheritance.html
// https://reactjs.org/docs/render-props.html

const VideoChat = props => {
	const [receivingCall, setReceivingCall] = useState(false);
	const [callerSignal, setCallerSignal] = useState();
	const [renderCount, setRenderCount] = useState(0);
	const {
		socket, yourID, partnerVideo, callAccepted, setCallAccepted,
		stream, userVideo, peerID, setPeerID,
	} = props;

	const acceptCall = () => {
		setCallAccepted(true);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });

		peer.on('signal', data => {
			socket.current.emit('acceptCall', { signal: data, to: peerID });
		});
		peer.on('stream', currentStream => {
			partnerVideo.current.srcObject = currentStream;
		});
		peer.signal(callerSignal);
	};

	const ignoreCall = () => {
		setCallAccepted(false);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});
		peer.on('close', () => { peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });
		peer.on('signal', data => {
			socket.current.emit('ignoreCall', { signal: data, to: peerID });
		});
		peer.signal(callerSignal);
		console.log('called ignoreCall()...');
	};

	const endCall = isInitiator => {
		setCallAccepted(false);
		const peer = new Peer({
			initiator: isInitiator,
			trickle: false,
		});
		// eslint-disable-next-line no-unused-expressions
		peer.on('close', () => { peer && peer.destroy(); });
		peer.on('error', () => { console.log('disconnected from peer'); });
		if (isInitiator) {
			peer.on('signal', data => {
				socket.current.emit('endCall', { signal: data, to: peerID });
			});
		}
		socket.current.on('callEnded', () => {
			console.log('callEnded');
		});
		console.log('resetting state...');
		setReceivingCall(false);
		setPeerID(null);
		setCallerSignal(null);
	};

	const incomingVideo = () => {
		if (callAccepted) {
			return (
				<Draggable>
					<div style={{
						display: 'flex',
						flexFlow: 'column wrap',
						zIndex: 900,
						position: 'absolute',
						bottom: 0,
						right: 0,
					}}>
						<video
							playsInline
							ref={partnerVideo}
							autoPlay
							style={{
								height: 300,
								width: 'auto',
							}}
						/>
						<Button variant="danger" onClick={() => endCall(true)}>End Call</Button>
					</div>
				</Draggable>
			);
		}
		return '';
	};

	useEffect(() => {
		if (socket.current && renderCount === 0) {
			socket.current.on('receivingCall', data => {
				setReceivingCall(true);
				setPeerID(data.from);
				setCallerSignal(data.signal);
			});

			socket.current.on('callIgnored', data => {
				// setReceivingCall(false);
				setPeerID(data.from);
				setCallerSignal(data.signal);
			});

			socket.current.on('callEnded', () => {
				console.log('ending call...');
				endCall(false);
			});
			setRenderCount(0);
		}
	}, [socket, yourID, partnerVideo]);
	return (
		<>

			{receivingCall
				? <IncomingCall ignoreCall={ignoreCall} acceptCall={acceptCall} caller={peerID} />
				: ''
			}

			{stream
				? <Draggable>
					<video
						playsInline
						muted
						ref={userVideo}
						autoPlay
						style={{
							height: 100,
							width: 'auto',
							zIndex: 900,
							position: 'absolute',
							top: 0,
							right: 0,
						}}
					/>
				</Draggable>
				: ''
			}
			{incomingVideo()}

		</>
	);
};

export default VideoChat;
