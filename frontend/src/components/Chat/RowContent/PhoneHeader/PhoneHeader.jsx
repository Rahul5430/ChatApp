import './PhoneHeader.css';
import src1 from '../../../../assets/logo-out.png';
import src2 from '../../../../assets/logout.png';

const PhoneHeader = ({ room }) => {
	return (
		<div id='main-phone-header'>
			<img src={src1} alt='logo' id='phone-logo' />
			<h1>{room}</h1>
			<a href='/'>
				<img src={src2} alt='leave' />
			</a>
		</div>
	);
};

export default PhoneHeader;
