import { useContext } from 'react';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';
import { NftContractContext } from '../contexts';
import { INftContractContext } from '../contexts/nftContract';

export interface IProps extends React.Props<any> { }

export interface IBaseComponentProps extends IProps {
	navigate: NavigateFunction;
	params: Readonly<Params<string>>;
	nftContractContext: INftContractContext;
}

export function withComponent<P extends React.Props<any>>(Component: new (props: P & IBaseComponentProps) => React.Component<P & IBaseComponentProps, {}, any>) {
	return (props: P) => <Component {...(props as (P & IBaseComponentProps))} navigate={useNavigate()} params={useParams()} nftContractContext={useContext(NftContractContext)} />;
}
