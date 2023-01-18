// import { BrowserRouter, Switch } from 'react-router-dom';
import Join from './components/Join';
import Chat from './components/Chat';
import useSocket from './hooks/useSocket';
import './App.css';

function App() {
	const client = useSocket();

	return (
		// <BrowserRouter>
			// <Switch>
				// {/* <Route path='/chat' component={Chat} /> */}
				// {/* <Route exact path='/' component={Join} /> */}
			// </Switch>
			<div className='app'>
				{client.user ? (
					<Chat client={client} />
				) : (
					<Join logIn={client.logIn} />
				)}
			</div>
		// </BrowserRouter>
	);
}

export default App;
