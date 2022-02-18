import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NftContractContext } from '../contexts';

export function withComponent(Component) {
	return props => <Component {...props} navigate={useNavigate()} params={useParams()} nftContractContext={useContext(NftContractContext)} />;
}
