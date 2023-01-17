import logo from '../../../assets/logo-out.png';
import './Logo.css';

const Logo = () => {
	return (
		<div className='header-universal'>
			<div id='header-logo'>
				<img src={logo} alt='Logo' id='logo-out' />
				<h1>ChatApp</h1>
			</div>
			<div id='header-main'>
				<h1 id='header-name'>ChatApp</h1>
				<h2 id='header-description'>
					Easiest way of communicating <br /> Sign in and start
					talking
				</h2>
			</div>
		</div>
	);
};

export default Logo;
