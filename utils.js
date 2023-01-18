const sessions = new Map();
let users = [];
let rooms = [];

const addUser = ({ id, name, room }) => {
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();

	const existingUser = users.find(
		(user) => user.name === name && user.room === room
	);

	if (!name && !room) {
		return { error: 'Username and room are required.' };
	}

	if (existingUser) {
		return { error: 'This username already exists.' };
	}

	let rooms = [];

	for (let i = 0; i < users.length; i++) {
		if (users[i].name === name) {
			if (users[i].rooms.indexOf(room) === -1) {
				console.log(users[i]);
				rooms = users[i].rooms;
				users[i].rooms.push(room);
			}
		}
	}

	// if (rooms.indexOf(room) === -1) {
	// 	rooms.push(room);
	// }
	if (rooms.length === 0) {
		rooms.push(room);
	}

	const user = { id, name, room, rooms };

	users.push(user);
	console.log(users);

	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		for (let i = index; i < users.length; i++) {
			if (i === index) {
				continue;
			}
			if (users[i].name === users[index].name) {
				users[i].rooms.splice(
					users[i].rooms.indexOf(users[index].room),
					1
				);
			}
		}

		return users.splice(index, 1)[0];
	}
};

const getUser = (id) => {
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === id) {
			return users[i];
		}
	}
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
	sessions,
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};
