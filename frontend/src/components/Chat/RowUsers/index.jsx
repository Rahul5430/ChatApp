import Users from './Users/Users';
import src1 from '../../../assets/chat-room-home.png';
import src2 from '../../../assets/logo-out.png';
import src3 from '../../../assets/leave-room.png';
import './RowUsers.css';

const RowUsers = ({ room, users }) => {
	return (
		<div id='row-users-main-container'>
			<div id='row-users-header'>
				<img src={src1} alt='Home' />
				<h1>{room}</h1>
			</div>
			<div id='users'>
				<Users users={users} />
			</div>
			<div id='footer'>
				<div id='logo-column'>
					<img src={src2} alt='Logo' />
					<h1>ChatApp</h1>
				</div>
				<div id='leave-column'>
					<a href='/'>
						<img src={src3} alt='leave' />
						<h2>Leave</h2>
					</a>
				</div>
			</div>
		</div>
	);
};

export default RowUsers;
