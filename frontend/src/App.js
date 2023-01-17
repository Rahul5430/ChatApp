import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Join from './components/Join';
import Chat from './components/Chat';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path='/chat' component={Chat} />
				<Route exact path='/' component={Join} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
