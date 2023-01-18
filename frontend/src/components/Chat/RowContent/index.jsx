import src from '../../../assets/send.png';
import Messages from './Messages/Messages';
import PhoneHeader from './PhoneHeader/PhoneHeader';
import './RowContent.css';

const RowContent = ({
	message,
	setMessage,
	sendMessage,
	messages,
	name,
	room,
	typingStatus,
	socket,
}) => {
	const handleTyping = (e) => {
		console.log(message);
		socket.emit('typing', {
			status: `${name} is typing...`,
			name,
		});
	};

	return (
		<div id='row-content-main-container'>
			<PhoneHeader room={room} />
			<div
				id='message-box'
				style={{
					paddingBottom:
						typingStatus?.status?.length === 0 ||
						typingStatus?.name === name
							? '0px'
							: '18px',
				}}
			>
				<Messages
					messages={messages}
					name={name}
					socket={socket}
					typingStatus={typingStatus}
				/>
			</div>
			<form id='form'>
				<input
					type='text'
					value={message}
					placeholder='Type a message...'
					onChange={(event) => setMessage(event.target.value)}
					onKeyPress={(event) =>
						event.key === 'Enter'
							? sendMessage(event)
							: handleTyping(event)
					}
				/>
				<button onClick={(event) => sendMessage(event)}>
					<img src={src} alt='send' />
					<h1>Send</h1>
				</button>
			</form>
		</div>
	);
};

export default RowContent;
