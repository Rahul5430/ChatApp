import { useState, useEffect, useRef } from 'react';
// import queryString from 'query-string';
// import io from 'socket.io-client';
// import RowContent from './RowContent';
// import RowUsers from './RowUsers';
import './styles/Chat.css';
import LeftSideBar from './LeftSideBar';
import ChatArea from './ChatArea';
import RightSideBar from './RightSideBar';

// let socket;

const Chat = ({
	client: {
		user,
		logOut,
		users,
		chat,
		rooms,
		createRoom,
		updateRoom,
		deleteRoom,
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

	// const handleAppClick = (e) => {
	// 	if (showEmoji && !emojiSelector.current.contains(e.target)) {
	// 		setShowEmoji(false);
	// 	}
	// };

	const handleMessageSubmit = () => {
		sendMessage(message);
		setMessage('');
	};

	// const [name, setName] = useState('');
	// const [room, setRoom] = useState('');
	// const [rooms, setRooms] = useState([]);
	// const [users, setUsers] = useState([]);
	// const [message, setMessage] = useState('');
	// const [messages, setMessages] = useState([]);
	// const [typingStatus, setTypingStatus] = useState({});

	// const END_POINT = 'http://localhost:3001';

	// useEffect(() => {
	// 	let { name, room } = queryString.parse(location.search);

	// 	socket = io(END_POINT);

	// 	setName(name);
	// 	setRoom(room);

	// 	socket.emit('join', { name, room });

	// 	return () => {
	// 		socket.disconnect();
	// 		socket.off();
	// 	};
	// }, [END_POINT, location.search]);
	// }, [END_POINT]);

	// console.log(location.search);

	// useEffect(() => {
	// 	socket.on('typingResponse', ({ data }) => setTypingStatus(data));

	// 	socket.on('message', (message) => {
	// 		setMessages((messages) => [...messages, message]);
	// 	});

	// 	socket.on('roomData', ({ users, rooms }) => {
	// 		setRooms(rooms);
	// 		setUsers(users);
	// 	});
	// }, []);

	// const sendMessage = (event) => {
	// 	event.preventDefault();
	// 	console.log(message);

	// 	if (message) {
	// 		socket.emit('sendMessage', message);
	// 		socket.emit('typing', { name, status: '' });
	// 		setMessage('');
	// 	}
	// };

	return (
		<div className='chat_app main-chat-container'>
			{/* <div className='chat-container'> */}
			{/* <RowUsers
					room={room}
					name={name}
					users={users}
					rooms={rooms}
					setName={setName}
					setRoom={setRoom}
				/> */}
			{/* <RowContent
					message={message}
					setMessage={setMessage}
					sendMessage={sendMessage}
					messages={messages}
					name={name}
					room={room}
					typingStatus={typingStatus}
					socket={socket}
				/> */}
			<LeftSideBar user={user} users={users} logOut={logOut} />
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
			{/* </div> */}
		</div>
	);
};

export default Chat;
