import React, { useState, useEffect, useRef } from 'react';
import LeftSideBar from './LeftSideBar';
import ChatArea from './ChatArea';
import RightSideBar from './RightSideBar';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const Chat = ({
	client: {
		user,
		logOut,
		users,
		chat,
		rooms,
		privateRooms,
		createRoom,
		updateRoom,
		deleteRoom,
		createPrivateRoom,
		sendMessage,
		typing,
		userTyping,
		stoppedTyping,
	},
}) => {
	const [roomName, setRoomName] = useState('');
	const [message, setMessage] = useState('');
	const [showEmoji, setShowEmoji] = useState(false);

	const chatBottomRef = useRef(null);
	const emojiSelector = useRef();

	const { height, width } = useWindowDimensions();

	const scrollToBottom = () => {
		chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [chat, user.roomId]);

	// keyup for message input
	const handleKeyUp = (e, message) => {
		if (e.keyCode === 13) {
			sendMessage(message);
			setMessage('');
			setShowEmoji(false);
		}
	};

	const handleEmojiKeyUp = (e) => {
		if (e.keyCode === 13) {
			sendMessage(message);
			setMessage('');
			setShowEmoji(false);
		}
	};

	const handleMessageChange = (e) => {
		setMessage(e.target.value);
		typing();
	};

	const addEmoji = (e) => {
		let emoji = e.native;
		setMessage((prevMessage) => prevMessage + emoji);
	};

	// keyup for room input
	const handleKeyUpRoom = (e) => {
		if (e.keyCode === 13) {
			createRoom(e.target.value);
			setRoomName('');
		}
	};

	const handleAppClick = (e) => {
		if (showEmoji && !emojiSelector.current.contains(e.target)) {
			setShowEmoji(false);
		}
	};

	const handleMessageSubmit = () => {
		sendMessage(message);
		setMessage('');
	};

	return (
		<div
			className='chat_app main-chat-container'
			onClick={(e) => handleAppClick(e)}
		>
			{width <= 1024 ? (
				<React.Fragment>
					<div className='responsive_left_sidebar'>
						<LeftSideBar
							user={user}
							users={users}
							logOut={logOut}
							createPrivateRoom={createPrivateRoom}
						/>
						<RightSideBar
							rooms={rooms}
							user={user}
							updateRoom={updateRoom}
							deleteRoom={deleteRoom}
							chat={chat}
							roomName={roomName}
							setRoomName={setRoomName}
							handleKeyUpRoom={handleKeyUpRoom}
							createRoom={createRoom}
						/>
					</div>
					<ChatArea
						user={user}
						rooms={rooms}
						chat={chat}
						chatBottomRef={chatBottomRef}
						userTyping={userTyping}
						showEmoji={showEmoji}
						emojiSelector={emojiSelector}
						handleEmojiKeyUp={handleEmojiKeyUp}
						addEmoji={addEmoji}
						setShowEmoji={setShowEmoji}
						message={message}
						handleMessageChange={handleMessageChange}
						handleKeyUp={handleKeyUp}
						stoppedTyping={stoppedTyping}
						handleMessageSubmit={handleMessageSubmit}
					/>
				</React.Fragment>
			) : (
				<React.Fragment>
					<LeftSideBar
						user={user}
						users={users}
						logOut={logOut}
						createPrivateRoom={createPrivateRoom}
					/>
					<ChatArea
						user={user}
						rooms={rooms}
						chat={chat}
						chatBottomRef={chatBottomRef}
						userTyping={userTyping}
						showEmoji={showEmoji}
						emojiSelector={emojiSelector}
						handleEmojiKeyUp={handleEmojiKeyUp}
						addEmoji={addEmoji}
						setShowEmoji={setShowEmoji}
						message={message}
						handleMessageChange={handleMessageChange}
						handleKeyUp={handleKeyUp}
						stoppedTyping={stoppedTyping}
						handleMessageSubmit={handleMessageSubmit}
					/>
					<RightSideBar
						rooms={rooms}
						user={user}
						updateRoom={updateRoom}
						deleteRoom={deleteRoom}
						chat={chat}
						roomName={roomName}
						setRoomName={setRoomName}
						handleKeyUpRoom={handleKeyUpRoom}
						createRoom={createRoom}
					/>
				</React.Fragment>
			)}
		</div>
	);
};

export default Chat;
