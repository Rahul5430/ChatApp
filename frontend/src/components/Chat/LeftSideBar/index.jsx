import logo from '../../../assets/logo-out.png';

const LeftSideBar = ({ user, users, logOut, createPrivateRoom }) => {
	return (
		<div className='left_sidebar'>
			<div className='logo_text'>
				<img src={logo} alt='Logo' id='logo-out' />
				<h1>
					<span>Chat</span>
					<span className='colored'>App</span>
				</h1>
			</div>

			<div className='profile_info'>
				<img src={user.avatar} className='avatar_profile' alt='' />
				<span>{user.username}</span>
				<p onClick={() => logOut()}>Logout</p>
			</div>

			<span style={{ alignSelf: 'flex-start', fontWeight: '600' }}>
				Online Users
			</span>
			<div className='active_users_list'>
				{users?.length > 1 ? (
					users?.map((u, i) => {
						if (u.userId !== user.userId) {
							return (
								<div
									className='user_card'
									key={`${u.userId}-${i}`}
									onClick={() => createPrivateRoom(u)}
								>
									<img
										src={u.avatar}
										className='small_img'
										alt=''
									/>
									<span>{u.username}</span>
								</div>
							);
						} else return null;
					})
				) : (
					<div className='announcement'>
						<span>No users online</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default LeftSideBar;
