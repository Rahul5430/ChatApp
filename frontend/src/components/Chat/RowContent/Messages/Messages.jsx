import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message/Message';
import './Messages.css';

const Messages = ({ messages, name, typingStatus }) => {
	return (
		<ScrollToBottom className='message-boxx'>
			{messages.map((message, idx) => (
				<div key={`message-${idx}`}>
					<Message message={message} name={name} />
				</div>
			))}
			<div className='typing-status'>
				{typingStatus.name === name ? '' : typingStatus.status}
			</div>
		</ScrollToBottom>
	);
};

export default Messages;
