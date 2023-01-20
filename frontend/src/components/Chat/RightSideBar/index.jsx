const RightSideBar = ({
	rooms,
	privateRooms,
	user,
	updateRoom,
	deleteRoom,
	updatePrivateRoom,
	deletePrivateRoom,
	chat,
	roomName,
	setRoomName,
	handleKeyUpRoom,
	createRoom,
}) => {
	console.log(privateRooms);
	console.log(rooms);
	return (
		<div className='right_sidebar'>
			<span style={{ alignSelf: 'flex-start', fontWeight: '600' }}>
				Rooms
			</span>
			<div className='active_rooms_list'>
				{rooms?.map((room) => (
					<div
						className={
							room.id === user.roomId
								? 'room_card active_item'
								: 'room_card'
						}
						key={room.id}
						onClick={() => updateRoom(room.id)}
					>
						<div className='room_item_content'>
							<img
								src={room.avatar}
								className='small_img'
								alt=''
							/>
							<div className='roomInfo'>
								<span>{room.name}</span>
								<span className='room_author'>
									{room.username}
								</span>
							</div>
						</div>

						<div className='room_item_controls'>
							{room.userId === user.userId && (
								<div
									onClick={() => deleteRoom(room.id)}
									style={{ margin: 3 }}
								>
									<i
										className='far fa-trash-alt'
										style={{ color: 'grey' }}
									/>
								</div>
							)}
							{chat[room.id]?.unread > 0 &&
								room.id !== user.roomId && (
									<div className='badge'>
										{chat[room.id]?.unread}
									</div>
								)}
						</div>
					</div>
				))}
			</div>
			{/* {console.log(
				privateRooms?.some((privateRoom) =>
					privateRoom?.members?.find(user.userId)
				)
			)} */}
			<span style={{ alignSelf: 'flex-start', fontWeight: '600' }}>
				Private Rooms
			</span>
			<div className='active_rooms_list'>
				{privateRooms?.map((privateRooms) => (
					<div
						className={
							privateRooms.id === user.roomId
								? 'room_card active_item'
								: 'room_card'
						}
						key={privateRooms.id}
						onClick={() => updatePrivateRoom(privateRooms.id)}
					>
						<div className='room_item_content'>
							<img
								// src={room.avatar}
								className='small_img'
								alt=''
							/>
							<div className='roomInfo'>
								{/* <span>{room.name}</span> */}
								<span className='room_author'>
									{/* {room.username} */}
								</span>
							</div>
						</div>

						<div className='room_item_controls'>
							{/* {room.userId === user.userId && (
								<div
									onClick={() => deletePrivateRoom(room.id)}
									style={{ margin: 3 }}
								>
									<i
										className='far fa-trash-alt'
										style={{ color: 'grey' }}
									/>
								</div>
							)} */}
							{/* {chat[room.id]?.unread > 0 &&
								room.id !== user.roomId && (
									<div className='badge'>
										{chat[room.id]?.unread}
									</div>
								)} */}
						</div>
					</div>
				))}
			</div>

			<div className='room_input'>
				<input
					type='text'
					value={roomName}
					placeholder='Create room'
					onChange={(e) => setRoomName(e.target.value)}
					onKeyUp={(e) => handleKeyUpRoom(e)}
				/>
				<span
					className='room_add_icon_holder'
					onClick={() => {
						createRoom(roomName);
						setRoomName('');
					}}
				>
					{/* <i class="plus icon"></i> */}+
				</span>
			</div>
		</div>
	);
};

export default RightSideBar;
