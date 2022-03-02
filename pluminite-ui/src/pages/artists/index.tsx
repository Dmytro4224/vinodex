import React, { Component } from 'react';
import ArtistCard from '../../components/artistCard/ArtistCard';
import { BestArtistsParameter } from '../../types/BestArtistsParameter';
import { IAuthorResponseItem } from '../../types/IAuthorResponseItem';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';

export interface IArtistsView extends IProps {
	parameter?: BestArtistsParameter;
}

interface IArtistsViewState {
	isLoading: boolean;
	list: Array<IAuthorResponseItem>;
}

class ArtistsView extends Component<IArtistsView & IBaseComponentProps, IArtistsViewState> {

	private _parameter: BestArtistsParameter;
	private _pageIndex: number = 1;
	private _pageSize: number = 20;
	private _isReverse: boolean = false;

	constructor(props: IArtistsView & IBaseComponentProps) {
		super(props);

		this._parameter = this.props.parameter || BestArtistsParameter.followers_count;

		this.state = {
			isLoading: true,
			list: []
		};
	}

	public componentDidMount() {
		this.props.nftContractContext.authors_by_filter(this._parameter, this._isReverse, this._pageIndex, this._pageSize).then(response => {
			console.log('ArtistsView response', response);
			const list = response.filter(item => item !== null);
			this.setState({ ...this.state, list, isLoading: false });
			//this.list = response.filter(el => el !== null);

			//console.log("🚀 ~ file: BestArtists.tsx ~ line 57 ~ BestArtists ~ this.props.nftContractContext.authors_by_filter ~ response", response)
		});
	}

	public isLoading() {
		return this.state.isLoading;
	}

	public render() {
		if (this.state.isLoading) {
			return (
				<div className="my-5 container">
					<p>Loading...</p>
				</div>
			);
		}
		return (
			<div className="my-5 container">
				<div className="d-flex flex-wrap flex-gap-36 mt-3">
					{this.state.list.map((item, index) => <ArtistCard
						key={`artist-${item.account_id}`}
						info={item}
						identification={item.account_id}
						usersCount={item.followers_count}
						likesCount={item.likes_count}
						isLike={item.is_like}
						isFollow={item.is_following} />
					)}
				</div>
			</div>
		);
	}
}

export default withComponent(ArtistsView);