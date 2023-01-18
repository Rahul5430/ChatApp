import { useState } from 'react';
import Logo from './Logo';
import './styles/Join.css';
import './styles/mediaQueries.css';

const avatars = [
	'https://semantic-ui.com/images/avatar2/small/patrick.png',
	'https://semantic-ui.com/images/avatar2/small/kristy.png',
	'https://semantic-ui.com/images/avatar2/small/mark.png',
	'https://semantic-ui.com/images/avatar2/small/matthew.png',
	'https://semantic-ui.com/images/avatar2/small/elyse.png',
	'https://semantic-ui.com/images/avatar2/small/lindsay.png',
];

const Join = ({ logIn }) => {
	const [username, setUsername] = useState('');
	const [avatar, setAvatar] = useState(
		'https://semantic-ui.com/images/avatar2/small/patrick.png'
	);

	return (
		<div className='joinOuterContainer'>
			<Logo />
			<div className='joinInnerContainer'>
				<div id='form-area'>
					<h1 className='heading'>Join</h1>
					<p className='join-phone'>Sign in to join a room!</p>
					<div>
						<input
							type='text'
							className='joinInput'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							spellCheck={false}
							autoCapitalize='words'
							autoComplete='off'
							required
						/>
						<label>Name</label>
					</div>
					<div className='avatar_list'>
						{avatars.map((avt, idx) => (
							<div
								className={
									avatar === avt
										? 'avatar active_avatar'
										: 'avatar'
								}
								key={idx}
							>
								<img
									src={avt}
									className='avatar_image'
									alt=''
									onClick={() => setAvatar(avt)}
								/>
							</div>
						))}
					</div>
					<button
						className='button'
						type='submit'
						onClick={() => logIn({ username, avatar })}
						disabled={username.length === 0}
					>
						Sign In
					</button>
				</div>
			</div>
		</div>
	);
};

export default Join;
