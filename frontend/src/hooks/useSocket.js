import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const END_POINT = 'http://localhost:3001';

const socket = io(END_POINT, {
	autoConnect: false,
});

const useSocket = () => {
	let u, a;
	const [user, setUser] = useState();
	const [users, setUsers] = useState();
	const [rooms, setRooms] = useState();
	const [privateRooms, setPrivateRooms] = useState();
	const [chat, setChat] = useState({});

	const [userTyping, setUserTyping] = useState();
	const [typingTimer, setTypingTimer] = useState();

	useEffect(() => {
		// get session and connect with session as auth
		const sessionId = sessionStorage.getItem('sessionId');
		if (sessionId) {
			socket.auth = { sessionId };
			socket.connect();
			console.log('Trying to reconnect with sessionId');
		}

		socket.on('connect', () => {
			console.log('Connected to server successfully');

			if (!sessionId) {
				socket.emit('user', { username: u, avatar: a });
			}

			socket.emit('setUpUser');
		});

		socket.on('session', ({ sessionId, userId }) => {
			socket.auth = { sessionId };
			sessionStorage.setItem('sessionId', sessionId);
			socket.userId = userId;
		});

		socket.on('user', (sUser) => {
			setUser(sUser);
		});

		socket.on('users', (sUsers) => {
			setUsers(sUsers);
		});

		socket.on('rooms', (sRooms) => {
			setRooms(sRooms);
		});

		socket.on('room', (roomId) => {
			setUser((prevUser) => ({ ...prevUser, roomId: roomId }));
		});

		socket.on('receiverJoinPrivateRoom', (privateRoomId) => {
			socket.emit('joinPrivateRoom', privateRoomId);
		});

		socket.on('privateRooms', (pRooms) => {
			console.log(pRooms);
			console.log(user);
			console.log(users);
			setPrivateRooms(pRooms);
		});

		socket.on('chat', (message) => {
			setChat((prevChat) => ({
				...prevChat,
				[message.room]: {
					messages: [
						...(prevChat[message.room]?.messages || []),
						message,
					],
					unread:
						(prevChat[message.room]?.unread || 0) +
						(message.type === 'message' ? 1 : 0),
				},
			}));
		});

		socket.on('typing', (username) => {
			setUserTyping(username);
		});

		socket.on('stoppedTyping', () => {
			setUserTyping(null);
		});

		return () => {
			console.log('Disconnected from server');
			socket.disconnect();
		};
	}, []);

	const logIn = ({ username, avatar }) => {
		u = username;
		a = avatar;
		socket.auth = { username };
		socket.connect();
	};

	const logOut = () => {
		setUser(null);
		sessionStorage.removeItem('sessionId');
		socket.disconnect();
		console.log('User logged out');
	};

	const sendMessage = (message) => {
		socket.emit('message', message);
	};

	const createRoom = (roomName) => {
		console.log('emit createRoom');
		socket.emit('createRoom', roomName);
	};

	const updateRoom = (roomId) => {
		socket.emit('updateRoom', roomId);

		setChat((prevchat) => ({
			...prevchat,
			[user.roomId]: {
				...prevchat[user.roomId],
				unread: 0,
			},
			[roomId]: {
				...prevchat[roomId],
				unread: 0,
			},
		}));
	};

	const deleteRoom = (roomId) => {
		socket.emit('deleteRoom', roomId);
	};

	const createPrivateRoom = (u) => {
		console.log(u);
		console.log(user);
		socket.emit('createPrivateRoom', u.userId, user.userId);
	};

	const upatePrivateRoom = (roomId) => {
		socket.emit('upatePrivateRoom', roomId);
	};

	const deletePrivateRoom = (roomId) => {
		socket.emit('deletePrivateRoom', roomId);
	};

	const typing = () => {
		socket.emit('typing');
		clearTimeout(typingTimer);
		setTypingTimer(null);
	};

	const stoppedTyping = () => {
		if (typingTimer == null) {
			setTypingTimer(
				setTimeout(() => {
					socket.emit('stoppedTyping');
				}, 300)
			);
		}
	};

	const logStates = ({
		showUser = false,
		showUsers = false,
		showRooms = false,
		showChat = false,
	}) => {
		if (showUser) console.log(user);
		if (showUsers) console.log(users);
		if (showRooms) console.log(rooms);
		if (showChat) console.log(chat);
	};

	return {
		socket,
		user,
		users,
		chat,
		setChat,
		rooms,
		privateRooms,
		logIn,
		logOut,
		sendMessage,
		createRoom,
		updateRoom,
		deleteRoom,
		createPrivateRoom,
		upatePrivateRoom,
		deletePrivateRoom,
		typing,
		stoppedTyping,
		userTyping,
		logStates,
	};
};

export default useSocket;
