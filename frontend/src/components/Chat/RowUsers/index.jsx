import { useState } from 'react';
import { Link } from 'react-router-dom';
import Users from './Users/Users';
import src1 from '../../../assets/chat-room-home.png';
import src2 from '../../../assets/logo-out.png';
import src3 from '../../../assets/leave-room.png';
import './RowUsers.css';

const RowUsers = ({ room, name, users, rooms, setName, setRoom }) => {
	const [clicked, setClicked] = useState(false);
	// const [newName, setNewName] = useState('');
	const [newRoom, setNewRoom] = useState('');
	console.log(room);

	console.log(rooms);
	return (
		<div id='row-users-main-container'>
			{rooms.map((room, i) => (
				<Link
					id='row-users-header'
					key={`${room}-${i}`}
					to={`/chat?name=${name}&room=${room}`}
				>
					{/* <div id='row-users-header' key={`${room}-${i}`}> */}
					<img src={src1} alt='Home' />
					<h1>{room}</h1>
					{/* </div> */}
				</Link>
			))}
			<div id='users'>
				<Users users={users} />
			</div>
			<div
				id='footer'
				style={{
					flexDirection: clicked ? 'column' : null,
					height: clicked ? 'auto' : null,
				}}
			>
				{clicked && (
					<div id='footer-up'>
						<div>
							<input
								type='text'
								className='joinInput'
								defaultValue={name}
								// onChange={(e) => setNewName(e.target.value)}
								spellCheck={false}
								autoCapitalize='words'
								autoComplete='off'
								// required
								disabled
							/>
						</div>
						<div>
							<input
								type='text'
								className='joinInput'
								onChange={(e) => setNewRoom(e.target.value)}
								spellCheck='false'
								autoComplete='off'
								required
							/>
							<label>Room</label>
						</div>
						<Link
							onClick={(e) =>
								!name || !newRoom ? e.preventDefault() : null
							}
							to={`/chat?name=${name}&room=${newRoom}`}
						>
							<button className='button' type='submit'>
								Sign In
							</button>
						</Link>
					</div>
				)}
				<div
					id='footer-bottom'
					style={{
						height: clicked ? 'auto' : null,
						marginBottom: clicked ? '0.5em' : null,
					}}
				>
					<div id='logo-column'>
						<img src={src2} alt='Logo' />
						<h1>ChatApp</h1>
					</div>
					<div id='new-group' onClick={() => setClicked(!clicked)}>
						<div>
							<img src={src3} alt='leave' />
							<h2>New Group</h2>
						</div>
					</div>
					<div id='leave-column'>
						<a href='/'>
							<img src={src3} alt='leave' />
							<h2>Leave</h2>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RowUsers;
