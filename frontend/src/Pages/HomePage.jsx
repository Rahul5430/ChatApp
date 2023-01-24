import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

const HomePage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('userInfo'));

		if (user) navigate('/chats');
	}, [navigate]);

	return (
		<Container maxW='xl' centerContent>
			<Box
				display='flex'
				justifyContent='center'
				p={3}
				bg='white'
				w='100%'
				m='40px 0 15px 0'
				borderRadius='lg'
				borderWidth='1px'
			>
				<Text fontSize={'xl'} fontFamily='Work sans'>
					ChatApp
				</Text>
			</Box>
			<Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
				<Tabs isFitted variant='soft-rounded'>
					<TabList mb='1em'>
						<Tab>Login</Tab>
						<Tab>Sign up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<Signup />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default HomePage;
