import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, HStack, VStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useRadio, useRadioGroup } from '@chakra-ui/radio';
import { chakra } from '@chakra-ui/system';
import { Image } from '@chakra-ui/image';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const Signup = () => {
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);
	const toast = useToast();
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [password, setPassword] = useState('');
	const [pic, setPic] = useState('https://semantic-ui.com/images/avatar2/small/patrick.png');
	const [picLoading, setPicLoading] = useState(false);

	const avatars = [
		{
			name: 'Patrick',
			image: 'https://semantic-ui.com/images/avatar2/small/patrick.png',
		},
		{
			name: 'Kristy',
			image: 'https://semantic-ui.com/images/avatar2/small/kristy.png',
		},
		{
			name: 'Mark',
			image: 'https://semantic-ui.com/images/avatar2/small/mark.png',
		},
		{
			name: 'Matthew',
			image: 'https://semantic-ui.com/images/avatar2/small/matthew.png',
		},
		{
			name: 'Elyse',
			image: 'https://semantic-ui.com/images/avatar2/small/elyse.png',
		},
		{
			name: 'Lindsay',
			image: 'https://semantic-ui.com/images/avatar2/small/lindsay.png',
		},
	];

	const handleChange = (value) => {
		setPic(value);
	};

	const { getRadioProps, getRootProps } = useRadioGroup({
		name: 'avatar',
		defaultValue: 'Patrick',
		onChange: handleChange,
	});

	const CustomRadio = (props) => {
		const { image, ...radioProps } = props;
		const {
			state,
			getInputProps,
			getCheckboxProps,
			htmlProps,
			getLabelProps,
		} = useRadio(radioProps);

		return (
			<chakra.label {...htmlProps} cursor='pointer'>
				<input {...getInputProps({})} hidden />
				<Box
					{...getCheckboxProps()}
					bg={state.isChecked ? 'green.200' : 'transparent'}
					w={14}
					p={1}
					rounded='full'
				>
					<Image src={image} rounded='full' {...getLabelProps()} />
				</Box>
			</chakra.label>
		);
	};

	const submitHandler = async () => {
		setPicLoading(true);
		if (!name || !email || !password || !confirmpassword || !pic) {
			toast({
				title: 'Please Fill all the Feilds',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setPicLoading(false);
			return;
		}
		if (password !== confirmpassword) {
			toast({
				title: 'Passwords Do Not Match',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setPicLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			const { data } = await axios.post(
				'/api/user',
				{
					name,
					email,
					password,
					pic,
				},
				config
			);
			console.log(data);
			toast({
				title: 'Registration Successful',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			localStorage.setItem('userInfo', JSON.stringify(data));
			setPicLoading(false);
			navigate('/chats');
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setPicLoading(false);
		}
		console.log(name, email, password, pic);
	};

	const postDetails = (pics) => {
		setPicLoading(true);
		if (pics === undefined) {
			toast({
				title: 'Please Select an Image!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}
		console.log(pics);
		if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
			const data = new FormData();
			data.append('file', pics);
			data.append('upload_preset', 'chat-app');
			data.append('cloud_name', 'rahulsharma');
			fetch('https://api.cloudinary.com/v1_1/rahulsharma/image/upload', {
				method: 'post',
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setPic(data.url.toString());
					console.log(data.url.toString());
					setPicLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setPicLoading(false);
				});
		} else {
			toast({
				title: 'Please Select an Image!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setPicLoading(false);
			return;
		}
	};

	return (
		<VStack spacing={'5px'}>
			<FormControl id='first-name' isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder='Enter Your Name'
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>
			<FormControl id='email' isRequired>
				<FormLabel>Email Address</FormLabel>
				<Input
					type='email'
					placeholder='Enter Your Email Address'
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id='password' isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size='md'>
					<Input
						type={show ? 'text' : 'password'}
						placeholder='Enter Password'
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={handleClick}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id='password' isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size='md'>
					<Input
						type={show ? 'text' : 'password'}
						placeholder='Confirm password'
						onChange={(e) => setConfirmpassword(e.target.value)}
					/>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={handleClick}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id='pic' isRequired>
				<FormLabel>Upload your Picture or Choose an Avatar</FormLabel>
				<Input
					type='file'
					p={1.5}
					accept='image/*'
					onChange={(e) => postDetails(e.target.files[0])}
				/>
				<HStack
					{...getRootProps()}
					mt='5px'
					justify={'center'}
					align='center'
					wrap='wrap'
				>
					{avatars.map((avatar) => {
						return (
							<CustomRadio
								key={avatar.name}
								image={avatar.image}
								{...getRadioProps({ value: avatar.image })}
							/>
						);
					})}
				</HStack>
			</FormControl>
			<Button
				colorScheme='blue'
				width='100%'
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={picLoading}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default Signup;
