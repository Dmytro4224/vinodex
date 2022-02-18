import { useNavigate, useParams } from 'react-router-dom';

export function withComponent(Component) {
	return props => <Component {...props} navigate={useNavigate()} params={useParams()} />;
}